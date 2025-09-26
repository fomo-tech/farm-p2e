import React, { useEffect, useRef, useState } from 'react'
import horn from 'assets/images/home_horn_icon.png'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { useTranslation } from 'react-i18next'
import Marquee from 'react-fast-marquee'

const NoticeBar = () => {
  const { configApp } = useGlobalAppStore()
  const { i18n, t } = useTranslation()
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const marqueeText = () => {
    const data = configApp?.HOME_NOTIFICATION && JSON.parse(configApp?.HOME_NOTIFICATION)
    if (i18n?.language === 'vi') return data?.vi
    if (i18n?.language === 'zh') return data?.zh
    return data?.en
  }

  const handleCycleComplete = () => {
    setFadeOut(true)
    setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        setFadeOut(false)
        setShow(true)
      }, 10000) // Hiện lại sau 10 giây
    }, 700) // Thời gian fade-out
  }

  if (!configApp?.HOME_NOTIFICATION || !show) return null
  return (
    <div className={`notice-bar max-w-[350px] w-full absolute z-[999] top-[10%] left-1/2 -translate-x-1/2
      ${fadeOut ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className='van-notice-bar'>
        <div className="size-[5rem]">
          <img src={horn} className='size-[5rem] animate-[wiggle_1s_ease-in-out_infinite]' />
        </div>
        <div className='van-notice-bar__wrap'>

          <Marquee className='text-[3rem]'
            gradient={false} pauseOnHover speed={40} delay={1}
            onCycleComplete={handleCycleComplete}
          >
            {
              configApp?.HOME_NOTIFICATION &&
              <div className='text-[#473535]' ref={contentRef}>
                <span className='font-[900] text-red-600'>
                  &nbsp;   &nbsp;  &nbsp;   &nbsp; &nbsp;
                  &nbsp;   &nbsp;  &nbsp;   &nbsp; &nbsp;
                  &nbsp;   &nbsp;  &nbsp;   &nbsp; &nbsp;
                  {t("Thông báo")}:&nbsp;
                </span>
                {marqueeText()}
              </div>
            }

          </Marquee>


        </div>
      </div>
    </div>
  )
}

export default NoticeBar