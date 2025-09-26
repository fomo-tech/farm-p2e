import { message, Modal, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthApp } from 'store/useAuthApp'
import requestService from 'api/request'
import { useGlobalAppStore } from 'store/useGlobalApp'
import clsx from 'clsx'
import j120 from 'assets/images/boom_v2 copy.png'
import RandomReward from './components/RandomReward'
import box from 'assets/images/guess_btn_bg.png'
import LuckyWheelGuide from './components/LuckyWheelGuide'
import MineGuide from './components/MineGuide'
const Treasure = () => {

  const { t, i18n } = useTranslation()
  const { handleCallbackUser, configApp, handleLoading } = useGlobalAppStore()
  const { user, onSetUser } = useAuthApp()
  const [itemWinner, setItemWinner] = useState<any>(null)
  const [openGuide, setOpenGuide] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rewardItems = [
    { id: 1, img: "/icons/diamond-icon.svg", label: "$0.05", reward: "0.05" },
    { id: 2, img: "/icons/diamond-icon.svg", label: "$0.1", reward: "0.1" },
    { id: 3, img: "/icons/diamond-icon.svg", label: "$0.2", reward: "0.2" },
    { id: 4, img: "/icons/diamond-3.svg", label: "$0.5", reward: "0.5" },
    { id: 5, img: "/icons/diamond-5.svg", reward: "1", label: "$1" },
    { id: 6, img: "/icons/diamond-6.svg", reward: "5", label: "$5" },
    { id: 7, img: j120, reward: "lucky" },
  ];



  const handleMine = async (index: number) => {

    setIsClick(true)
    if (isClick) return
    try {
      const res = await requestService.post('/checkin/mine')
      if (res && res.data && user) {
        onSetUser({
          ...user,
          realBalance: user?.realBalance - 0.2
        })
        const resultReward = res.data.data;
        const targetIndex = rewardItems.findIndex((item) => item.reward === resultReward);
        if (targetIndex === -1) throw new Error("Reward not found");
        setActiveIndex(index)
        setItemWinner(rewardItems[targetIndex])
        handleCallbackUser()

      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message || "Please try agian !!!",
        duration: 3,
        placement: 'top'
      })
      setIsClick(false)
    }


  }

  useEffect(() => {
    // Nếu itemWinner có giá trị, bắt đầu setTimeout
    if (itemWinner) {
      const timeoutId = setTimeout(() => {
        setItemWinner(null);  // Đặt lại itemWinner sau 5 giây
        setIsClick(false);    // Đặt lại trạng thái isClick
      }, 1700);

      // Dọn dẹp (cleanup) khi itemWinner thay đổi hoặc component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [itemWinner]);  // Chạy lại khi itemWinner thay đổi



  return (
    <div className='  '>
      <div className="game--card relative z-10 p-[3rem]">
        <MineGuide
          onClose={() => setOpenGuide(false)}
          open={openGuide}
        />
        <div className='mb-2 flex justify-between items-center'>
          <div>
            {t("Lượt quay")} : <span>{user?.mineNum || 0}</span>
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e77e29',
              textShadow: '2px 2px 4px #c9c2b8',
              cursor: 'pointer',
              userSelect: 'none',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(-5deg)')}
            onClick={() => setOpenGuide(true)}
          >
            {t("Hướng dẫn")}
          </div>
        </div>
        <div className="mine-box-wrapper" >
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="mine-box mineBox gold-box " id={`mine${index + 1}`}
              onClick={() => {
                // return message.warning("Open on Monday")
                handleMine(index)
              }}
            >
              {
                index === activeIndex && itemWinner ?
                  <div className="mine-box-wrapper" key={index}>
                    <div className={clsx("mine-box-front", {
                      "border-[.3rem] border-yellow-500 glow-yellow rounded-[12px]": index === activeIndex
                    })}>
                      <img
                        src={itemWinner?.img}
                        alt="image"
                        className='animation-bounceCard !w-[8rem] !h-[8rem]'

                      />
                      {
                        itemWinner?.label &&
                        <div className='text-[2.5rem] text-[#000] font-[700]'>
                          {itemWinner?.label}
                        </div>
                      }
                    </div>
                    <div className="mine-box-hidden" />
                  </div>
                  :
                  itemWinner ?

                    <RandomReward key={index} />
                    :
                    <div className="mine-box-wrapper" key={index}>
                      <div className="mine-box-front">
                        <img
                          src={box}
                          alt="image"
                          className='animation-bounceCard'
                        />
                      </div>
                      <div className="mine-box-hidden" />
                    </div>
              }

            </div>
          ))}
        </div>


      </div>
    </div>
  )
}

export default Treasure