import { DrawerLang } from 'components/ui/DrawerLang'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import avt_default from 'assets/img_custom/public_botany_2.png'
import addMoney from 'assets/img_custom/home_add_icon.png'
import { useAuthApp } from 'store/useAuthApp'
import vip1 from 'assets/images/vip-5.png'
import { formatNumber } from 'lib/helpers'
import { useGlobalAppStore } from 'store/useGlobalApp'
import bg_avt from 'assets/img_custom/trialtask_bg_nums.png'
import { renderVip } from 'constants/vipIcon'
import clsx from 'clsx'


const MainHeader = () => {
  const [openLang, setOpenLang] = useState(false)
  const { handleToggleModal } = useGlobalAppStore()
  const { t } = useTranslation();
  const { user } = useAuthApp()




  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] sm:max-w-[100rem] m-auto flex items-center justify-between p-[3.2rem] bg-transparent">
      <div className='flex gap-2 items-center relative cursor-pointer'
        onClick={() => handleToggleModal({
          name: "profile",
          type: "drawer",
          title: <div className='text-center text-[#fff] font-[900]'>
            Profile
          </div>
        })}
      >
        <div className='relative'>
          <img src={bg_avt} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
          <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
            <img src={avt_default} alt='logo' className='rounded-full w-[10rem] h-[10rem] z-10' />
          </div>
        </div>
        <div className='flex flex-col gap-1 bg-[#ffffffe6] rounded-3xl opacity-95 absolute px-[10px] left-0 top-[40px] pt-[4px]'>
          <div className='flex gap-1 text-[12px] items-center font-[900] text-[#733e39]'>
            VIP
            <img src={renderVip(user?.farmVip || 0)} className={clsx('size-[20px]', {
              'size-[30px]': user && user?.farmVip > 0
            })} />
          </div>
        </div>
      </div>

      <div className='flex gap-2 items-center relative'>

        <img src={"https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"} alt='logo' className='rounded-full w-[8rem] z-10' />
        <div className='flex justify-center items-center flex-col gap-1 bg-[#ffffffe6] ml-[-25px] p-[25px] pr-[20px] py-[7px] rounded-3xl opacity-95 relative'>
          <div className='text-center flex gap-1 !text-[12px] items-center font-[900] text-[#733e39] min-w-[70px]'>
            {formatNumber(Number(user?.realBalance?.toFixed(3)))}
          </div>
          <div className='absolute z-50 right-[-15px] top-1/2 translate-y-[-50%] cursor-pointer'
            onClick={() => handleToggleModal({
              name: "deposit",
              type: 'drawer',
              title: <div className='text-center text-[#fff]'>
                {t("home.deposit")}
              </div>
            })}
          >
            <img src={addMoney} width={30} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default MainHeader