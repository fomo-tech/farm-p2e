import home_land from 'assets/img_custom/home_land_bg_unseeded.png';
import home_land_unlock from 'assets/img_custom/home_land_bg_seedable.png';
import home_unclock from 'assets/img_custom/home_icon_ad_unlock.png';
import lock_icon from 'assets/img_custom/pup_icon_lock.png'
import bg_icon_tips from 'assets/img_custom/home_icon_tips_bg_img.png'
import { notification, Popover, Progress, Tag } from 'antd';
import { useState } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useTranslation } from 'react-i18next';
import { useAuthApp } from 'store/useAuthApp';
import { useGlobalAppStore } from 'store/useGlobalApp';
import requestService from 'api/request';
import clsx from 'clsx';
import { socket } from 'lib/socket';
interface Props {
  isLock?: boolean;
  isMark?: boolean;
  isShowLock?: boolean;
  order?: any
}

const Land = ({ isLock, order, isMark, isShowLock }: Props) => {
  const [showIconHarvest, setShowIconHarvest] = useState(true)
  const { user } = useAuthApp()
  const { handleCallbackUser, handleLoading, handleToggleModal, loading } = useGlobalAppStore()
  const [loadingharvest, setLoadingHarvest] = useState(false)
  const { t } = useTranslation()

  const handleHarvest = async (id: string) => {
    handleLoading(true)
    setLoadingHarvest(true)
    try {
      // const token = await getRecaptchaToken();
      const res = await requestService.post('/tickets/harvest', {
        data: {
          orderId: id,
          // recaptchaToken: token
        }
      })
      if (res && res.data) {
        handleCallbackUser()
        socket.emit("getOrders", { userId: user?._id });

      }

    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
        placement: "top"
      })
    } finally {
      handleLoading(false)
      setLoadingHarvest(false)
    }

  }

  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span>{t("-")}</span>;
    }

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
      <span className='font-[700]'>
        {days > 0 ? `${days} ${t('ngày')} ` : ''}
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  };


  return (
    <div className="relative">
      {isMark && (
        <div className="absolute top-0 left-0 z-[10] w-full h-full rotate-[-45deg] flex justify-center items-center">
          <div className='relative cursor-pointer'
            onClick={() => {
              handleToggleModal({
                name: "buy_land",
                type: "modal",
                title: "Unlock"
              })
            }}

          >
            <div className="absolute top-[-10px] left-0 z-[10] w-full h-full rotate-[-45deg] flex justify-center items-center">
              <div className='flex gap-1 items-center text-[12px] font-[700] rotate-[45deg]'>
                8
                <img src={"/icons/diamond-icon.svg"} width={18} />
              </div>
            </div>
            <img src={home_unclock} width={50} alt="Unlock icon" />
          </div>
        </div>
      )}
      {isShowLock && (
        <div className="absolute top-0 left-0 z-[10] w-full h-full rotate-[-45deg] flex justify-center items-center">
          <img src={lock_icon} width={30} alt="Unlock icon" />
        </div>
      )}

      {isLock ? (
        <img
          src={home_land}
          className="absolute top-1 scale-[1.35] rotate-[-45deg] left-1 w-full h-full"
          alt="Land lock"
        />
      ) : (
        <img
          src={home_land_unlock}
          className="absolute top-1 scale-[1.35] rotate-[-45deg] left-1 w-full h-full"
          alt="Land unlock"
        />
      )}
      {
        order && !isLock &&
        <div className='absolute top-1/2 translate-y-[-50%]  rotate-[-45deg] left-1/2 translate-x-[-50%] w-full h-full'>
          <div className='relative cursor-pointer'>
            <Popover
              className='popover-custom'
              trigger={['click', 'hover', 'focus']}
              onOpenChange={(vl) => setShowIconHarvest(!vl)}
              content={
                /// info animal

                <div className='flex flex-col gap-2 bg-[#fefefe] px-3 rounded-3xl'>
                  <div className='flex gap-2 items-center'>

                    <div className='flex flex-col'>
                      <div className='text-[10px] text-[#0e0d0d]'>
                        {t("Thời gian sống")} : <Countdown
                          renderer={renderer}
                          date={order?.endTime}
                        />
                      </div>
                      <div className='text-[10px] text-[#0e0d0d] flex items-center gap-1'>
                        {t("Sản lượng hôm nay")}:  <span className='font-[900]'>
                          + {Number(order?.currentIncome?.toFixed(5))}
                          <img src={'/icons/diamond-icon.svg'} width={15} className='inline ml-2' />
                        </span>
                      </div>

                    </div>
                  </div>

                </div>}>
              <div className='animal'>
                <img
                  src={order?.ticket?.desImage}
                  className={clsx(" w-full h-full ", {
                    "scale-[1.5]": order?.ticket?.vip === 4,
                    "scale-[1.4]": order?.ticket?.vip === 5,
                    "mt-[-10px]": order?.ticket?.vip === 5
                  })} ///animal-move
                  alt="animal"
                />
              </div>
            </Popover>


            {/* icon harverst */}
            {
              !loadingharvest && showIconHarvest && (Date.now() >= order?.rewardTime || Date.now() >= order?.endTime) && order?.status &&

              <div className='absolute top-[-15px] left-1/2 translate-x-[-50%] translate-y-[-50%] z-[9999]'>
                <div className='relative'
                  onClick={() => handleHarvest(order?._id)}
                >
                  <img src={bg_icon_tips} />
                  <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                    <img src={'/icons/diamond-icon.svg'} width={20} className='ml-[-5px] mt-[-5px]' />
                  </div>
                </div>
              </div>
            }


            {/* Progress */}


          </div>
          {
            !((Date.now() >= order?.rewardTime || Date.now() >= order?.endTime)) &&
            <div className='absolute bottom-[10%] left-[50%] translate-x-[-50%]  z-[9999]'>
              <div className='w-[70px] relative'>
                <Progress percent={((Date.now() - order?.startTime) / (order?.rewardTime - order?.startTime)) * 100}
                  trailColor={"#fefefe"}
                  strokeColor="#42c885"
                  showInfo={false}
                  status="active"
                />
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                  <div className='text-[5px] text-[#4d4e56] mt-[-2px] font-[700]'>
                    <Countdown
                      renderer={renderer}
                      date={order?.rewardTime}
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

    </div>
  );
};

export default Land;
