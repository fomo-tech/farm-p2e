import { message, Modal, notification } from 'antd'
import choujiang from 'assets/img_custom/frp_dlg_recharge_rewards_bg.webp'
import iconClose from 'assets/img_custom/clolor_dialog_close.png'
import home_red from 'assets/img_custom/find_cp_ic_reward_red_package.webp'
import home_txt from 'assets/img_custom/color_task_active_icon_1.png'
import { useState } from 'react'
import requestService from 'api/request'
import { useAuthApp } from 'store/useAuthApp'
import { useGlobalAppStore } from 'store/useGlobalApp'
import reward_bg from 'assets/images/reward_case_bg.png'

import home_h_an1 from 'assets/images/home_h_an1.png'
import { TRANSACTION_TYPE_LIXI_REWARD } from 'constants/define'
import Countdown from 'react-countdown'
import { useTranslation } from 'react-i18next'
const LuckyMoney = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultReward, setResultReward] = useState<any>(null)
  const { t } = useTranslation()
  const { handleCallbackUser, events, handleLoading } = useGlobalAppStore()

  const handleOpenLuckyMoney = async () => {

    if (loading) return
    try {
      setLoading(true)
      handleLoading(true)
      const res = await requestService.post('/checkin/lucky-money')
      if (res && res?.data) {
        setTimeout(() => {
          setResultReward(res?.data?.data?.value || 0);
        }, 200);
      }
      handleCallbackUser()
    } catch (error: any) {
      console.log(error);
      setOpen(false)
      notification.error({
        message: error?.response?.data?.message,
        duration: 3
      })
      setLoading(false)
    }
    setLoading(false)
    handleLoading(false)
  }
  const event = events && events?.find((i: any) => i?.event_type === TRANSACTION_TYPE_LIXI_REWARD)

  return (
    <>
      <div className="relative">
        {/* Hiệu ứng nhấp nháy xung quanh biểu tượng */}
        <div className="absolute inset-0 flex justify-center items-center z-10 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-red-500 opacity-70"></div>
        </div>

        {/* Vùng click */}
        <div
          className="absolute w-full h-full flex justify-center items-center z-20 cursor-pointer"
          onClick={() => {
            setOpen(true)
            setResultReward(null)
          }}
        >
          <div className="mt relative">
            <img src={home_red} width={45} />
            {
              Date.now() <= event?.timeEnd &&
              Date.now() >= event?.timeStart &&
              <div className="absolute  w-full text-center top-[-7px] left-0 bg-red-600 text-white text-[8px] px-[1px] py-[3px] rounded-full animate-bounce z-30 shadow-md">
                <Countdown
                  date={event?.timeEnd}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return <span>{t("Đã kết thúc")}</span>;
                    }

                    const pad = (n: any) => String(n)?.padStart(2, '0');
                    const formatted = `${days > 0 ? `${days} ngày ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                    return <span>{formatted}</span>;
                  }}
                />
              </div>
            }

          </div>
        </div>

        {/* Hình ảnh nền */}
        <img src={home_txt} width={60} />

        {/* Nhãn "Sự kiện" */}

      </div>

      <Modal open={open}
        onCancel={() => {
          setOpen(false)
          setResultReward(null)
        }}
        footer={null}
        maskClosable={!resultReward}
        closeIcon={
          !resultReward && <img src={iconClose} className='max-w-[7rem] ' />
        }
        centered width={400} style={{
          background: "none"
        }} className='lixi-event' >
        {
          resultReward ?
            <div className='relative'>
              <div className='absolute top-0 left-0 w-full h-full flex gap-2 flex-col justify-center items-center'>
                <div className='flex gap-2 items-center'>
                  <div className='text-[#fff] font-[900] text-[70px]'>+ {resultReward}</div>
                  <div>
                    <img src={"/icons/diamond-icon.svg"} width={50} />
                  </div>
                </div>
                <div className='relative'>
                  <img src={home_h_an1} className='max-w-[120px]' />
                  <div
                    onClick={() => {
                      setOpen(false)
                      setResultReward(null)
                    }}
                    className='cursor-pointer absolute top-0 text-[#fff] cusor-pointer font-[700] left-0 w-full h-full flex gap-2 flex-col justify-center items-center'>
                    {t("Đóng")}
                  </div>
                </div>
              </div>
              <img src={reward_bg} />
            </div>
            :
            <div className='
            size-[200px] mx-auto
            relative lixi-event-animation cursor-pointer' onClick={() => handleOpenLuckyMoney()}>
              <img src={choujiang} className=' cursor-pointer' />
              <div className='absolute top-[40%] left-0 w-full h-full flex flex-col justify-center items-center '>
                <div className=' flex gap-[5rem] items-center text-[2rem] mb-[5px]'>
                  <div className='text-[#fff] font-[900]'>
                    {
                      Date.now() <= event?.timeEnd &&
                      Date.now() >= event?.timeStart &&
                      <Countdown
                        date={event?.timeEnd}
                        renderer={({ days, hours, minutes, seconds, completed }) => {
                          if (completed) {
                            return <span>{t("Đã kết thúc")}</span>;
                          }

                          const pad = (n: any) => String(n)?.padStart(2, '0');
                          const formatted = `${days > 0 ? `${days} ngày ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                          return <span>{formatted}</span>;
                        }}
                      />

                    }
                  </div>
                </div>
                <div className=' flex gap-[5rem] items-center text-[2rem]'>
                  <div className='text-[#fff] font-[900]'>
                    {t("Còn lại")} : {
                      Date.now() > event?.timeEnd ? (
                        <span>-</span>
                      ) :
                        event?.quantity}
                  </div>
                </div>

              </div>
              <div className='absolute top-[5%] left-0 w-full h-full flex flex-col justify-center items-center text-[20px] font-[900] text-[#bc6060]'>
                {t("Mở")}
              </div>

            </div>

        }

      </Modal>
    </>

  )
}

export default LuckyMoney