import { Drawer, message, Modal, notification } from 'antd'
import requestService from 'api/request'
import { clsx } from 'clsx'
import { formatNumber, getRecaptchaToken } from 'lib/helpers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthApp } from 'store/useAuthApp'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { useCopyToClipboard } from "@uidotdev/usehooks";
import Countdown from 'react-countdown'
import QRCode from 'react-qr-code'
// import binance from 'assets/images/withdrawal_binance_icon.png'
import { socket } from 'lib/socket'


const Deposit = () => {
  const { t } = useTranslation()
  const { user } = useAuthApp()
  const { configApp, handleLoading, handleCallbackUser } = useGlobalAppStore()
  const [paymentMethod, setPaymentMethod] = useState('crypto')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [_, copyToClipboard] = useCopyToClipboard();
  const [amount, setAmount] = useState(0)
  const [resultDeposit, seResultDeposit] = useState<any>(null)

  const reset = () => {
    setOpenConfirm(false)
    setAmount(0)
    setPaymentMethod('crypto')
    seResultDeposit(null)
  }

  useEffect(() => {
    if (socket) {
      socket.on("depositSuccess", (val: any) => {
        if (val?.isCheck) {
          notification.success({
            message: "Deposit success",
            duration: 5
          })
          reset()
          handleCallbackUser()
        }
      });
      return () => {
        socket.off("depositSuccess");
      };
    }
  }, [socket]);


  const handleDeposit = async () => {

    handleLoading(true)
    try {
      // const token = await getRecaptchaToken();
      const res = await requestService.post('/profile/deposit', {
        data: {
          amount,
          fiatAmount: amount * configApp?.rateUsd || 26000,
          paymentMethod,
          note: paymentMethod === 'crypto' ? "Nạp qua mạng BEP20" : "",
          // recaptchaToken: token
        }
      })
      if (res && res.data) {
        setOpenConfirm(true)
        seResultDeposit(res?.data?.data)
      }
    } catch (error: any) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
        placement: "top"
      })
    }
    handleLoading(false)
  }


  return (
    <>
      {
        !openConfirm ?
          <>
            <div data-v-0fbd6467="" className="amount-section">
              <div data-v-0fbd6467="" className="section-title">
                {t("Chọn số tiền")}
              </div>
              <div className="amount-grid grid !grid-cols-4" data-v-0fbd6467="">
                {[
                  "5", "10", "20",
                  "50", "100", "200",
                  "500", "1000"
                ].map((i, index) => (
                  <div
                    onClick={() => setAmount(+i)}
                    data-v-0fbd6467="" key={index} className={clsx("amount-item flex gap-2 items-center justify-center", {
                      "!border-[#dddd] border-[1px]": amount === +i
                    })}>
                    <span data-v-0fbd6467="" className="value">{i}</span>
                    {/* <span data-v-0fbd6467="" className="currency">$</span> */}
                  </div>
                ))}
              </div>


              <div data-v-0fbd6467="" className="van-cell van-field flex flex-col">
                {/**/}
                <div className="van-cell__title van-field__label">
                  <label
                    id="van-field-1-label"
                    htmlFor="van-field-1-input"
                    data-allow-mismatch="attribute"
                  >
                    {t("Số tiền tùy chỉnh")}
                  </label>
                  {/**/}
                </div>
                <div className="van-cell__value van-field__value">
                  <div className="van-field__body">
                    <input
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value || '0'))}
                      type="text"
                      inputMode="decimal"
                      id="van-field-1-input"
                      className="p-3.5 van-field__control van-field__control--right placeholder:text-[#cccc] text-left"
                      placeholder=""

                    />
                    {/**/}
                    <div className="van-field__right-icon">
                      <div data-v-0fbd6467="" className="right-content">
                        <span data-v-0fbd6467="" className="currency-label">
                          <img src={"https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"} width={30} />
                        </span>
                      </div>
                    </div>
                    {/**/}
                  </div>
                  {/**/}
                  {/**/}
                </div>
                {/**/}
                {/**/}
                {
                  paymentMethod === 'banking' && <> = {formatNumber(amount * configApp?.rateUsd || 0)} vnđ</>
                }

              </div>
            </div>
            <div data-v-0fbd6467="" className="channel-section">
              <div data-v-0fbd6467="" className="section-title">
                {t("Cổng thanh toán")}
              </div>
              <div data-v-0fbd6467="" className="channel-list">
                <div data-v-0fbd6467="" className={clsx("channel-item", {
                  "active": paymentMethod === 'crypto'
                })}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <span className='mr-3'>
                    <img src="https://bitbill.oss-accelerate.aliyuncs.com/pics/coins/bsc.svg" width={40} />
                  </span>
                  <span data-v-0fbd6467="" className='ml-4'>
                    {t("Giao dịch tiền mã hoá")}
                  </span>
                  {
                    paymentMethod === 'crypto' ?
                      <svg
                        data-v-0fbd6467=""
                        className="inline-block check-icon"
                        viewBox="0 0 24 24"
                        width="1.2em"
                        height="1.2em"
                        style={{ color: "#733e39" }}
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
                {
                  configApp?.PAYMENT_MAINTENANCE_DEPOSIT_BANKING === '0' &&
                  <div data-v-0fbd6467="" className={clsx("channel-item", {
                    "active": paymentMethod === 'banking'
                  })}
                    onClick={() => setPaymentMethod('banking')}
                  >
                    <img src="https://img.icons8.com/?size=100&id=5JNz5j18GI1S&format=png&color=000000" width={35} />
                    <span data-v-0fbd6467="" className='ml-4'>Banking</span>
                    {
                      paymentMethod === 'banking' ?
                        <svg
                          data-v-0fbd6467=""
                          className="inline-block check-icon"
                          viewBox="0 0 24 24"
                          width="1.2em"
                          height="1.2em"
                          style={{ color: "#733e39" }}
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
                }

              </div>

            </div>

            <div data-v-0fbd6467="" className="submit-section">
              <button
                disabled={amount === 0}
                onClick={handleDeposit}
                data-v-fed939fe=""
                type="button"
                className="w-full text-[#fff] van-button van-button--primary van-button--normal van-button--block"
              >
                <div className="van-button__content">
                  {/**/}
                  <span className="van-button__text">
                    {t("Xác nhận")}
                  </span>
                  {/**/}
                </div>
              </button>
            </div>
            <div data-v-0fbd6467="" className="notice-section">
              <div data-v-0fbd6467="" className="section-title">
                {t("Mô tả giá trị lưu trữ")}
              </div>
              <div data-v-0fbd6467="" className="notice-content">
                {/* {t("1: Do những biến động gần đây của mạng lưới ngân hàng,")}. */}
                1. {t("Nếu thanh toán của bạn không thành công, vui lòng thử")}
                {t("Liên hệ lại với chúng tôi trong vòng 5 phút")}
                {t("Báo cáo vấn đề cho bộ phận Dịch vụ khách hàng.")}
                <br />
                {t("2: Thời gian thanh toán là 5 phút")}
                <br />
                {t("3: Số tiền gửi tối thiểu là 10$")}

              </div>
            </div>
          </>
          :
          <div className='px-[4rem]' >
            <Countdown date={new Date(resultDeposit?.createdAt)?.getTime() + 1000 * 60 * 10}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  reset()
                } else {
                  return <div className='text-center text-[5rem] font-[700] text-[#fff] mb-[3rem]'>{minutes}:{seconds}</div>;
                }
              }}
            />
            {
              paymentMethod === 'crypto' ?
                //<img src={`${process.env.REACT_APP_BASE_URL}` + configApp?.paymentGateWay?.crypto?.imageQr} />
                <div className='max-w-[200px] w-full m-auto relative'>
                  <QRCode
                    size={150}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${configApp?.paymentGateWay?.crypto?.BEP20}`}
                    viewBox={`0 0 150 150`}
                  />
                  <div className='absolute w-full h-full top-0 left-0 flex justify-center items-center'>
                    <img src={"https://img.icons8.com/?size=100&id=DEDR1BLPBScO&format=png&color=000000"} width={50} />
                  </div>
                </div>
                :
                <img src={`https://img.vietqr.io/image/${configApp?.paymentGateWay?.banking?.code}-${configApp?.paymentGateWay?.banking?.numberBank}-compact2.png?amount=${amount * configApp?.rateUsd || 25000}&addInfo=${encodeURIComponent(resultDeposit?.note)}&accountName=${encodeURIComponent(configApp?.paymentGateWay?.banking?.holderName)}`} />
            }

            <div className='flex justify-between rem-3 items-center my-4'>
              <label className='font-[700] text-[#666]'>
                {t("Số Tiền Nạp")}
              </label>
              <div className='font-[900] text-[#564949] flex items-center gap-2 text-[4rem]'>{amount}$

                <div className='flex justify-end rem-3'

                >
                  <svg
                    onClick={() => {
                      copyToClipboard(`${amount}`)
                      notification.success({
                        message: "Copied",
                        duration: 2,
                        placement: "top"
                      })
                    }}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                  </svg>

                </div>
              </div>
            </div>
            {
              paymentMethod === 'crypto' &&
              <>
                <div className='flex justify-between rem-3 items-center mb-4'>
                  <label className='font-[700] text-[#666]'>
                    {t("Mạng lưới")}
                  </label>
                  <div className='font-[900] text-[#564949] text-[3rem] flex items-center'>
                    BNB Smart Chain (BEP20)
                  </div>

                </div>
                <div className='flex justify-between rem-3 items-center mb-4'>
                  <label className='font-[700] text-[#666]'>
                    {t("Địa chỉ nạp")}
                  </label>
                  <div className='font-[900] text-[#564949] text-right text-[2.5rem] flex items-center gap-3  max-w-[65%]' style={{
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word'
                  }}>
                    {configApp?.paymentGateWay?.crypto?.BEP20}
                    <div className='size-[4rem]'>
                      <svg
                        onClick={() => {
                          copyToClipboard(`${configApp?.paymentGateWay?.crypto?.BEP20}`)
                          notification.success({
                            message: "Copied",
                            duration: 2,
                            placement: "top"
                          })
                        }}
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                  </div>

                </div>
              </>
            }
            {
              paymentMethod === 'banking' &&
              <>
                <div className='flex justify-between rem-3 items-center mb-4'>
                  <label className='font-[700] text-[#564949]'>
                    {t("Số tiền thực tế")}
                  </label>
                  <div className='font-[700] text-[#564949] text-[3rem] flex items-center'>{formatNumber(amount * configApp?.rateUsd) || 26000}
                    <svg
                      onClick={() => {
                        copyToClipboard(`${amount * configApp?.rateUsd || 26000}`)
                        notification.success({
                          message: "Copied",
                          duration: 2,
                          placement: "top"
                        })
                      }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                    </svg>

                  </div>

                </div>
                <div className='flex justify-between rem-3 items-center mb-4'>
                  <label className='font-[700] text-[#564949]'>
                    {t("Tên Ngân Hàng")}
                  </label>
                  <div className='font-[700] text-[#564949] text-[3rem] flex items-center'>{configApp?.paymentGateWay?.banking?.nameBank}
                    <svg
                      onClick={() => {
                        copyToClipboard(`${configApp?.paymentGateWay?.banking?.nameBank}`)
                        notification.success({
                          message: "Copied",
                          duration: 2,
                          placement: "top"
                        })
                      }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                    </svg>

                  </div>
                </div>
                <div className='flex justify-between rem-3 items-center mb-4'>
                  <label className='font-[700] text-[#564949]'>
                    {t("Số Tài Khoản")}
                  </label>
                  <div className='font-[700] text-[#564949] text-[3rem] flex items-center'>{configApp?.paymentGateWay?.banking?.numberBank}
                    <svg
                      onClick={() => {
                        copyToClipboard(`${configApp?.paymentGateWay?.banking?.numberBank}`)
                        notification.success({
                          message: "Copied",
                          duration: 2,
                          placement: "top"
                        })
                      }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                    </svg>

                  </div>
                </div>
                <div className='flex justify-between rem-3 items-center mb-[15px]'>
                  <label className='font-[700] text-[#666]'>
                    {t("Nội dung")}
                  </label>
                  <div className='font-[900] text-[3rem] flex items-center text-red-600'>{resultDeposit?.note}
                    <svg
                      onClick={() => {
                        copyToClipboard(`${resultDeposit?.note}`)
                        notification.success({
                          message: "Copied",
                          duration: 2,
                          placement: "top"
                        })
                      }}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[4rem] ml-[5px] cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                    </svg>

                  </div>

                </div>


              </>
            }
            <div className='font-bold rem-3 text-[#666]'>
              Note : <span className='text-red-600'>{t("deposit_note")}</span>
            </div>
            <div className='flex justify-center mt-5'>
              <button className='flex items-center gap-1 text-[#564949]'
                onClick={() => reset()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                </svg>

                {t("Quay lại")}</button>
            </div>
          </div>
      }

    </>
  )
}


export default Deposit