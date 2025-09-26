import { Drawer, message, notification } from 'antd'
import requestService from 'api/request'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'
import { useTranslation } from 'react-i18next'
import { useAuthApp } from 'store/useAuthApp'
import { useGlobalAppStore } from 'store/useGlobalApp'
import bg from 'assets/images/yq_ljyq_bg.png'
import lock_icon from 'assets/img_custom/pup_icon_lock.png'
import { RulesTranlate } from 'locale/component/RulesTranlate'
interface IVipInfo {
  "id": number,
  "lv": number,
  "invite_num": number,
  "dividend": number,
  "product_profit": number,
  "level_up_money": number,
  "wage": number
}


interface Props {
  setOpen: (val: boolean) => void,
  open: boolean,

}


const AgencyReward = ({ open, setOpen }: Props) => {
  const { t } = useTranslation()
  const { user } = useAuthApp()
  const { configApp, handleCallbackUser } = useGlobalAppStore()
  const [data, setData] = useState<any>(null)
  const [showRule, setShowRule] = useState(false)
  const isCheckClaim = user && user.agencyReward < user.vip

  const handleClaimSalary = async () => {
    try {
      const res = await requestService.post('/profile/receive-salary')
      if (res && res.data) {
        notification.success({
          message: "Claimed",
          duration: 3,
          placement: "top"
        })
        // message.success("Claimed")
        handleCallbackUser()
      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
        placement: "top"
      })
    }
  }

  const getVipInfo = async () => {
    try {
      const res = await requestService.get('/profile/vip-info')
      if (res && res.data) {
        setData(res.data?.data)
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    if (open)
      getVipInfo()
  }, [open])


  const renderLinkImg = (lv: number) => {
    if (lv > 7) return "/icons/diamond-7.svg";
    if (lv > 6) return "/icons/diamond-6.svg";
    if (lv > 4) return "/icons/diamond-5.svg";
    if (lv > 2) return "/icons/diamond-3.svg";
    if (lv === 1 || lv === 2) return "/icons/diamond-icon.svg";
    return ""; // fallback nếu không khớp điều kiện nào
  };


  return (
    <Drawer
      title={
        <div className='text-center text-[#fff] font-[900]'>
          {t("Thưởng đại lý")}
        </div>
      }
      placement={'right'}
      style={{
        background: "#fff"
      }}
      closable={true}
      closeIcon={
        <div>
          {
            showRule ?
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#ffff] cursor-pointer"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              :
              <img src={close_icon} width={50} />
          }

        </div>
      }
      zIndex={99999}
      onClose={() => {
        showRule ? setShowRule(false) : setOpen(false)
      }}
      width="100rem"
      open={open}
      className='bg_custom_drawer'
    >
      {
        showRule ?
          <RulesTranlate />
          :
          <>
            <div data-v-0c054b6c="" className="page-content pb-[10rem]">

              <div data-v-0c054b6c="" className="current-level !justify-end !p-[2rem]"
              >
                <div className='font-[900] underline cursor-pointer' onClick={() => setShowRule(true)}>
                  {t("Điều kiện nhận thưởng")}</div>

              </div>
              <div data-v-0c054b6c="" className="salary-list pb-[50px]">
                {
                  user && configApp?.vipList?.map((i: IVipInfo, index: number) => (
                    <div data-v-0c054b6c="" className={clsx("salary-item ", {
                      "active": user && user.vip >= i.lv
                    })} key={index}>
                      <div data-v-0c054b6c="" className="item-content ">
                        <div data-v-0c054b6c="" className="level-badge">
                          <span data-v-0c054b6c="" className="badge-text !text-[13px]">
                            {t("Cấp")} {i.lv}
                          </span>
                        </div>
                        <div data-v-0c054b6c="" className="salary-info">
                          <div data-v-0c054b6c="" className="amount">
                            <span data-v-0c054b6c="" className="value !font-[900] flex items-center gap-2">
                              {i.wage} <img src={renderLinkImg(i?.lv)} className='inline-block' />
                            </span>
                          </div>
                        </div>
                        <div data-v-0c054b6c="" className="status">
                          {
                            user && user.vip < i.lv &&
                            <span>
                              <img src={lock_icon} width={40} />
                            </span>
                          }
                          {user && user.agencyReward >= i.lv && (
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 border border-green-500 rounded-full bg-green-50 text-green-600 font-semibold shadow-sm">
                              <img
                                src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/Check.svg"
                                alt="claimed"

                              />
                              <span className="text-[12px] font-[700]">Claimed</span>
                            </div>
                          )}

                        </div>
                      </div>
                      <div data-v-0c054b6c="" className="progress-bar">
                        <div data-v-0c054b6c="" className="progress-info">
                          <span data-v-0c054b6c="" className="progress-text">
                            {t("Invitation progress")}
                          </span>
                          <span data-v-0c054b6c="" className="progress-numbers">
                            {user.vip >= i.lv ? i.invite_num : data?.progress || 0}/{i.invite_num}
                          </span>
                        </div>
                        <div data-v-0c054b6c="" className="progress-track">
                          <div
                            data-v-0c054b6c=""
                            className="progress-fill"
                            style={{ width: user.vip >= i.lv ? "100%" : `${data?.progress * 100 / i.invite_num}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div data-v-0c054b6c="" className="bottom-button !absolute">
              <button
                disabled={!isCheckClaim}
                onClick={handleClaimSalary}
                data-v-0c054b6c=""
                type="button"
                className={clsx("w-full text-[#fff] van-button van-button--primary van-button--normal van-button--block", {

                })}
                style={{
                  background: !isCheckClaim ? "#cccc" : ""
                }}
              >
                <div className="van-button__content">
                  {/**/}
                  <span className="van-button__text">
                    {t("Receive reward")}
                  </span>
                  {/**/}
                </div>
              </button>
            </div>
          </>
      }


    </Drawer>
  )
}

export default AgencyReward