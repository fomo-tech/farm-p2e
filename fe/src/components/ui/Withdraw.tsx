import { Drawer, message, Modal, notification, Popover } from 'antd'
import requestService from 'api/request'
import { clsx } from 'clsx'
import { formatAddress, formatNumber } from 'lib/helpers'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthApp } from 'store/useAuthApp'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { AddPaymentMethod } from './AddPaymentMethod'
import PinInput from 'react-pin-input'
import useBreakpoint from 'hooks/useBreakpoint'


const Withdraw = () => {
  const { t } = useTranslation()
  const { user } = useAuthApp()
  const { configApp, handleLoading, handleCallbackUser } = useGlobalAppStore()
  const [openAddMethod, setAddMethod] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [_, copyToClipboard] = useCopyToClipboard();
  const [amount, setAmount] = useState(0)
  const [selectMethod, setSelectMethod] = useState(user?.bankList[0])
  const pinRef = useRef<any>(null);
  const breakpoint = useBreakpoint()
  const handleReset = () => {
    pinRef?.current?.clear(); // Reset input về trống
  };
  const reset = () => {
    // setAddMethod(false)
    setAmount(0)
    setSelectMethod(user?.bankList[0])
  }

  useEffect(() => {
    setSelectMethod(user?.bankList[0])
  }, [user])

  const handleWithdraw = async (paymentPassword: string) => {

    handleLoading(true)
    try {
      const res = await requestService.post('/profile/withdraw', {
        data: {
          amount: selectMethod?.nameBank === "BEP20" ?
            amount + amount * Number(configApp?.FEE_WIDTHDRAW) / 100
            : amount,
          fiatAmount: selectMethod?.nameBank === "BEP20" ? amount : (amount - amount * 0.01) * configApp?.rateUsdWithdraw
          ,
          paymentMethod: JSON.stringify(selectMethod),
          note: "WIDTHDRAW" + Date.now(),
          paymentPassword
        }
      })
      if (res && res.data) {
        handleCallbackUser()
        notification.success({
          message: "Withraw success!",
          duration: 3
        })
        // message.success()
      }
    } catch (error: any) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      notification.error({
        message: error?.response?.data?.message,
        duration: 3
      })
      // message.error(error?.response?.data?.message)
    }
    handleLoading(false)
    handleReset()
  }
  return (
    <>
      <AddPaymentMethod
        open={openAddMethod}
        setOpen={setAddMethod}
      />
      <div data-v-0fbd6467="" className="balance-card">
        <div data-v-0fbd6467="" className="label">
          {t("Số dư có thể rút")}
        </div>
        <div data-v-0fbd6467="" className="amount">
          <span data-v-0fbd6467="" className="value !text-[40px] !font-[900]">
            {Number(user?.realBalance?.toFixed(3))}
          </span>
          <span data-v-0fbd6467="" className="currency">
            <img src={'/icons/diamond-icon.svg'} width={50} />
          </span>
        </div>
      </div>
      <div data-v-7d13b5f8="" className="amount-section">
        <div data-v-7d13b5f8="" className="section-title">
          {t("Withdraw amount")}
        </div>
        <div data-v-7d13b5f8="" className="van-cell van-field">
          {/**/}
          {/**/}
          <div className="van-cell__value van-field__value">
            <div className="van-field__body gap-2">
              <input
                type="text"
                onChange={(e) => setAmount(parseFloat(e.target.value || "0"))}
                value={amount}
                inputMode="decimal"
                id="van-field-17-input"
                className="p-3.5 van-field__control van-field__control--right placeholder:text-[#cccc] text-left"
                placeholder="0"
                data-allow-mismatch="attribute"
              />
              {/**/}
              <div className="van-field__right-icon">
                <div data-v-7d13b5f8="" className="right-content">

                  <button
                    data-v-7d13b5f8=""
                    type="button"
                    className="van-button van-button--default van-button--small"
                    onClick={() => setAmount(user?.realBalance || 0)}
                  >
                    <div className="van-button__content">
                      {/**/}
                      <span className="van-button__text">All</span>
                      {/**/}
                    </div>
                  </button>
                </div>
              </div>
              {/**/}
            </div>
            {/**/}
            {/**/}
          </div>
          {/**/}
          {/**/}
        </div>
      </div>
      <div data-v-7d13b5f8="" className="channel-section">
        <div data-v-7d13b5f8="" className="section-title !text-[15px]">
          <span data-v-7d13b5f8="">
            {t("Select Bank Account")}
          </span>
          <button
            data-v-7d13b5f8=""
            type="button"
            onClick={() => {
              setTimeout(() => (
                setAddMethod(true)
              ), 150)


            }}
            className="van-button van-button--primary van-button--small justify-end van-button--plain add-btn"
          >
            <div className="van-button__content">
              {/**/}
              <span className="van-button__text">
                {t("Add Bank")}
              </span>
              {/**/}
            </div>
          </button>
        </div>
        <div data-v-7d13b5f8="" className="channel-list">
          {
            user && user?.bankList?.length > 0
            && user?.bankList?.map((i, index) => (
              <div data-v-7d13b5f8=""
                onClick={() => setSelectMethod(i)}
                className={clsx("channel-item", {
                  "active": i?.numberBank === selectMethod?.numberBank && i?.nameBank === selectMethod?.nameBank
                })} key={index}>
                {/* <svg
                  data-v-7d13b5f8=""
                  className="inline-block channel-icon"
                  viewBox="0 0 24 24"
                  width="1.2em"
                  height="1.2em"
                  style={{ color: "rgb(7, 193, 96)" }}
                >
                  <path
                    fill="currentColor"
                    d="M11.5 1L2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7z"
                  />
                </svg> */}
                <span className='mr-3'>
                  <img src="https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg" width={40} />
                </span>

                {
                  i?.nameBank === 'BEP20' ?
                    <Popover trigger={'click'} content={i.numberBank}>
                      <span data-v-1ad66f02="" className="value">
                        {formatAddress(i.numberBank)} ({i.nameBank})
                      </span>
                    </Popover>

                    :
                    <Popover trigger={'click'} content={i.numberBank}>
                      <span data-v-1ad66f02="" className="value">
                        {i.numberBank} ({i.nameBank})
                      </span>
                    </Popover>

                }

                {
                  i?.nameBank === selectMethod?.nameBank && i?.numberBank === selectMethod?.numberBank
                    ?
                    <svg
                      data-v-0fbd6467=""
                      className="inline-block check-icon"
                      viewBox="0 0 24 24"
                      width="1.2em"
                      height="1.2em"
                      style={{ color: "var(--primary-color)" }}
                    >
                      <path
                        fill="currentColor"
                        d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m0-5H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"
                      />
                    </svg>
                    :
                    <svg
                      data-v-0fbd6467=""
                      className="inline-block check-icon"
                      viewBox="0 0 24 24"
                      width="1.2em"
                      height="1.2em"
                      style={{ color: "rgb(238, 238, 238)" }}
                    >
                      <path
                        fill="currentColor"
                        d="M19 3H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 2v14H5V5z"
                      />
                    </svg>
                }
              </div>
            ))

          }

        </div>

      </div>
      <div data-v-7d13b5f8="" className="submit-section">
        <button
          onClick={() => {
            // const now = new Date();
            // const vnNow = new Date(now.getTime() + (7 * 60 - now.getTimezoneOffset()) * 60000);
            // const hours = vnNow.getHours();

            // Nếu nằm trong khoảng 23:00 - 09:00 thì hiển thị thông báo và return
            // if (hours >= 23 || hours < 9) {
            //     return message.warning("System under maintenance, please try again later.");
            // }
            if (!selectMethod) return message.warning(t("Bạn chưa cài đặt thanh toán"))
            setOpenConfirm(true)
          }}
          data-v-7d13b5f8=""
          disabled={!user || user.realBalance < amount || user.realBalance === 0}
          type="button"
          className="w-full text-[#fff] van-button van-button--primary van-button--normal van-button--block"
          style={{
            background: !user || user.realBalance < amount || user.realBalance === 0 ? "#bbb" : ""
          }}
        >
          <div className="van-button__content">
            {/**/}
            <span className="van-button__text">
              {t("Confirm withdrawal")}
            </span>
            {/**/}
          </div>
        </button>
      </div>

      <div data-v-7d13b5f8="" className="notice-section">
        <div data-v-7d13b5f8="" className="section-title">
          {t("Withdrawal instructions")}
        </div>
        <div data-v-7d13b5f8="" className="notice-content">
          {t(`1Số tiền rút tối thiểu: 2$`, {
            amount: configApp?.maxWithdraw
          })}. {t("Phí rút hiện tại", {
            amount: configApp?.FEE_WIDTHDRAW
          })} <br />
          {t("2Thời gian đón hàng ngày")}

          {/* {t("3quantrong_ruttien")} */}
          <br />
          3. {t("Giới hạn rút USDT: 50,6USDT-10.000USDT (chỉ hỗ trợ mạng BEP20)")}
          <br />
          4. {t(`meo`)}
        </div>
      </div>
      <Drawer
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        placement={breakpoint === 'mobile' ? 'bottom' : 'right'}
        height={"auto"}
        width={"100rem"}
        zIndex={9999999}
        className='security'
        closeIcon={false}
        title={
          <div className='flex justify-between'>
            <div className='cursor-pointer ' >
              {t("Nhập mật khẩu rút tiền")}
            </div>
            <div className='cursor-pointer' onClick={() => {
              // if (!!parseInt(configApp?.PAYMENT_MAINTENANCE))
              //     return message.warning("System under maintenance, please try again later.")

              setOpenConfirm(false)


            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </div>
          </div>
        }
      >
        <div className='flex justify-center flex-col items-center '>
          <div className='flex justify-between items-center w-full px-4 mb-4'>
            <label className='text-[3rem]'>
              {t("Phí rút")}
            </label>
            <div className='text-[3.5rem] font-[600]'>
              {configApp?.FEE_WIDTHDRAW || "0"}%
            </div>
          </div>
          <div className='flex justify-between items-center w-full px-4 mb-4'>
            <label className='text-[3rem]'>
              {t('home.amount')}
            </label>
            <div className='text-[3.5rem] font-[600]'>
              {
                selectMethod?.nameBank === 'BEP20' ? formatNumber(amount?.toFixed(2)) + " $" : formatNumber(((amount - amount * 0.01) * configApp?.rateUsdWithdraw)?.toFixed(0)) + "đ"}

            </div>
          </div>
          <div className='flex justify-between items-center w-full px-4 mb-4'>
            <label className='text-[3rem]'>
              {t("Cổng thanh toán")}
            </label>
            <div className='text-[3.5rem] font-[600]'>
              {selectMethod?.nameBank === 'BEP20' ? "BEP20" : "Banking"}
            </div>
          </div>
          <div className='flex justify-between items-center w-full px-4 mb-4'>
            <label className='text-[3rem]'>
              {t("Thông tin")}
            </label>
            <div className='text-[3.5rem] font-[600]'>
              {
                selectMethod?.nameBank === 'BEP20' ?
                  <span data-v-1ad66f02="" className="value">
                    {formatAddress(selectMethod?.numberBank)} ({selectMethod?.nameBank})
                  </span>

                  :
                  <span data-v-1ad66f02="" className="value">
                    {selectMethod?.numberBank} ({selectMethod?.nameBank})
                  </span>
              }
            </div>
          </div>
          <div className='flex justify-between items-center w-full px-4 mb-4'>
            <label className='text-[3rem]'>
              {t("Tổng tiền rút")}
            </label>
            <div className='text-[3.5rem] font-[600]'>
              {
                selectMethod?.nameBank === 'BEP20' ?
                  <span data-v-1ad66f02="" className="value">
                    {formatNumber((amount + amount * Number(configApp?.FEE_WIDTHDRAW) / 100)?.toFixed(1))} $
                  </span>

                  :
                  <span data-v-1ad66f02="" className="value">
                    {formatNumber(((amount - amount * 0.01) * configApp?.rateUsdWithdraw)?.toFixed(0)) + "đ"}
                  </span>
              }
            </div>
          </div>
        </div>
        <label className='text-[3rem] px-4'>
          {t("Nhập mật khẩu rút tiền")}
        </label>
        <PinInput
          length={6}
          secret

          secretDelay={400}
          inputMode="numeric"
          ref={pinRef}
          type="numeric"
          style={{ padding: '10px', width: "100%", display: 'flex', justifyContent: 'center', gap: "5px", zIndex: 99999999 }}
          inputStyle={{ borderColor: '#733e39', borderRadius: "10px", borderWidth: '4px' }}
          inputFocusStyle={{ borderColor: '#733e39' }}
          onComplete={async (value, index) => {
            handleReset()
            setOpenConfirm(false)
            await handleWithdraw(value)
          }}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />

      </Drawer >
    </>
  )
}


export default Withdraw