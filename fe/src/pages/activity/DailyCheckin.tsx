import React, { useState } from 'react'
import { message, Modal, notification } from 'antd'
import { useTranslation } from 'react-i18next'
import requestService from 'api/request'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { useAuthApp } from 'store/useAuthApp'
import bg_btn from 'assets/img_custom/home_h_an1.png'
import ButtonImage from 'components/elements/ButtonCustom'
const DailyCheckin = () => {
  const { t, i18n } = useTranslation()

  const [openRule, setOpenRule] = useState(false)
  const { configApp, handleCallbackUser } = useGlobalAppStore()
  const { user } = useAuthApp()

  const handleCheckin = async () => {
    if (user?.isCheckinToday) return
    try {
      const res = await requestService.post('/checkin')
      if (res && res.data) {
        handleCallbackUser()
      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message,
        duration: 3
      })
      // message.error(error?.response?.data?.message)
    }
  }

  const renderImg = (idx: number) => {
    switch (idx) {
      case 0:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg'
      case 1:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-2.svg'
      case 2:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-3.svg'
      case 3:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-4.svg'
      case 4:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-5.svg'
      case 5:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-6.svg'
      default:
        return 'https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-7.svg'
    }
  }

  return (

    <>
      <div data-v-11ffe290="" className="grid gap-3 pt-[15px] relative z-40"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(77px, 1fr))',
          gridArea: '3 / 1 / 4 / 3',
        }}>
        {
          configApp?.checkIn?.map((i: any, index: number) => (
            <div className='relative' key={i}>
              {
                index < (user?.checkInToday || 0) &&
                <div className='absolute right-[-5px] top-[-5px] z-50'>
                  <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/Check.svg"></img>
                </div>
              }
              <div
                // style={{
                //   opacity: index < (user?.checkInToday || 0) ? "0.6" : "1"
                // }}
                data-v-11ffe290="" data-dpr={1} className="text-[#fff] inline-flex flex-col items-center p-4 rounded-lg "
                style={{
                  width: '100%',
                  height: '90px',
                  background: "#6d717f",
                  borderRadius: "10px",
                  opacity: index < (user?.checkInToday || 0) ? "0.8" : "1"
                }} >

                <div className='flex gap-1 flex-col items-center justify-center'>
                  <div>
                    Day {index + 1}
                  </div>
                  <div>
                    <img src={renderImg(index)} width={35} />
                  </div>
                  <div>
                    + {i}
                  </div>
                </div>
              </div>
            </div>
          ))
        }

      </div>
      {
        !user?.isCheckinToday && <div className='flex justify-center w-full mt-[10px]'>
          <ButtonImage
            bgImg={bg_btn}
            title='Collect'
            onEvent={() => handleCheckin()}
            width={100}
          />
        </div>
      }

    </>

  )
}

export default DailyCheckin