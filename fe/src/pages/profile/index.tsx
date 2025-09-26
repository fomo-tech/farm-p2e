import requestService from 'api/request'
import TeamInvite from 'components/ui/home/TeamInvite'
import InviteFriend from 'components/ui/InviteFriend'
import RecordUserHistoires from 'components/ui/RecordUserHistory'
import SecurityCenter from 'components/ui/SecurityCenter'
import { hidePhoneNumber, removeLocalStoreageUser } from 'lib/helpers'
import React, { useState } from 'react'
import avt_default from 'assets/img_custom/public_botany_2.png'
import icon_agency from "assets/img_custom/color_wd_invite_icon.png"
import icon_history from 'assets/img_custom/color_achievement_icon_4.png'
import icon_analys from 'assets/img_custom/color_wd_success_pop_money1.png'
import { useTranslation } from 'react-i18next'
import bg_btn_withdraw from 'assets/img_custom/me_tx_bg.9.png'
import { useAuthApp } from 'store/useAuthApp'
import InvestmentStatistics from 'components/ui/InvestmentStatistics'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { renderVip } from 'constants/vipIcon'
import bg_avt from 'assets/img_custom/trialtask_bg_nums.png'
import bg_menu from 'assets/img_custom/skill_boss_family_boss_bg.webp'
import clsx from 'clsx'


const Profile = () => {
  const { user, logoutUser } = useAuthApp()
  const { handleToggleModal, handleLoading } = useGlobalAppStore()

  const [openInvitefriend, setOpenInviteFriend] = useState(false)
  const [openTeam, setOpenTeam] = useState(false)
  const [openSecurity, setOpenSecurity] = useState(false)
  const [openRecord, setOpenRecord] = useState(false)
  const [openInvestStatistics, setOpenInvestStatistics] = useState(false)

  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    handleToggleModal({
      name: "",
      type: "",
      title: ""
    })
    try {
      handleLoading(true)
      const res = await requestService.delete('/profile')
      if (res && res.data) {
        logoutUser()
        removeLocalStoreageUser()
        handleLoading(false)

      }
    } catch (error) {
      handleLoading(false)
      console.log(error);

    }
  }

  return (
    <div data-v-4f0a6390="" data-v-e697ea1f="" className="profile-page bg-no-repeat " >
      <div data-v-4f0a6390="" className="user-info">
        <div data-v-4f0a6390="" className="user-header">
          <div data-v-4f0a6390="" className="avatar-wrapper">
            <div
              data-v-4f0a6390=""
              className="van-image van-image--round "
              style={{ width: 70, height: 70, borderRadius: "50%" }}
            >
              <div className='relative w-full h-full '>
                <img src={bg_avt} alt='logo' className='rounded-full w-full h-full  z-50 object-cover' />
                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                  <img src={avt_default} alt='logo' className='rounded-full w-full h-full z-10' />
                </div>
              </div>
              {/**/}
              {/**/}
            </div>
            <div data-v-4f0a6390="" className="vip-badge min-w-[72px]">
              <span data-v-4f0a6390="" className="vip-icon flex items-center gap-1">
                VIP <img src={renderVip(user?.farmVip || 0)} className={clsx('size-[20px]', {
                  'size-[35px]': user && user?.farmVip > 0
                })} />
              </span>
            </div>
          </div>
          <div data-v-4f0a6390="" className="user-detail">
            <div data-v-4f0a6390="" className="nickname !text-[#fff]">
              {user && user?.phone}
            </div>
            <div data-v-4f0a6390="" className="user-id !text-[#fff]">
              ID: {user?.userId}
            </div>
          </div>
          <div data-v-4f0a6390="" className="balance items-end  flex flex-col  gap-1 !font-[900]" style={{ background: "transparent" }}>
            <div className='relative mb-[-5px] w-[70px] h-[30px]' onClick={() => handleToggleModal({
              name: "withdraw",
              type: "drawer",

            })}>
              <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <p className='text-[11px] font-[700] text-[#fff] mb-[2px] cursor-pointer'>{t("rút tiền")}</p>
              </div>
              <img src={bg_btn_withdraw} className='w-full h-full' />
            </div>
            <div className='flex items-center justify-end '>
              <span className='!font-[900] !text-[#fff]'>
                {Number(user?.realBalance?.toFixed(3))}
              </span>

              <img src={"/icons/diamond-icon.svg"} alt='' className='size-[30px] ml-2' />

            </div>

          </div>

        </div>

      </div>

      <div data-v-4f0a6390="" className="invite-card" onClick={() => setOpenInviteFriend(true)}>
        <div data-v-4f0a6390="" className="invite-content">
          <div data-v-4f0a6390="" className="invite-text ">
            <div data-v-4f0a6390="" className="title !text-[20px] !font-[900]">
              {t("Mời bạn bè tham gia")}
            </div>
            <div data-v-4f0a6390="" className="subtitle !text-[13px]">
              {t("Chia sẻ để nhận thêm phần thưởng")}
            </div>
          </div>

        </div>
      </div>

      <div data-v-4f0a6390="" className="action-list">
        <div className='relative h-[350px]'>
          <img src={bg_menu} className='w-full h-full' />
          <div data-v-4f0a6390="" className="action-group !mb-0">

            <div data-v-4f0a6390="" className="action-item" onClick={() => {
              setOpenInvestStatistics(true)

            }}>
              <div data-v-4f0a6390="" className="action-left">

                <img src={icon_analys}
                  className='w-[7rem]'
                />
                <span data-v-4f0a6390="">
                  {t("Thống kê đầu tư")}
                </span>
              </div>
              <i
                data-v-4f0a6390=""
                className="van-badge__wrapper van-icon van-icon-arrow"
              >

              </i>
            </div>


            <div data-v-4f0a6390="" className="action-item" onClick={() => setOpenRecord(true)}>
              <div data-v-4f0a6390="" className="action-left">

                <img src={icon_history}
                  className='w-[7rem]'
                />
                <span data-v-4f0a6390="">
                  {t("Lịch sử giao dịch")}
                </span>
              </div>
              <i
                data-v-4f0a6390=""
                className="van-badge__wrapper van-icon van-icon-arrow"
              >

              </i>
            </div>
            <div data-v-4f0a6390="" className="action-item" onClick={() => setOpenTeam(true)}>
              <div data-v-4f0a6390="" className="action-left">

                <img src={icon_agency}
                  className='w-[7rem]'
                />
                <span data-v-4f0a6390="">
                  {t("Đại lý trang trại")}
                </span>
              </div>
              <i
                data-v-4f0a6390=""
                className="van-badge__wrapper van-icon van-icon-arrow"
              >

              </i>
            </div>
            <div data-v-4f0a6390="" className="action-item" onClick={() => setOpenSecurity(true)}>
              <div data-v-4f0a6390="" className="action-left">

                <img src={"https://img.icons8.com/?size=100&id=xDx0LE8HzRiQ&format=png&color=000000"}
                  className='w-[7rem]'
                />
                <span data-v-4f0a6390="">
                  {t("Cài đặt")}
                </span>
              </div>
              <i
                data-v-4f0a6390=""
                className="van-badge__wrapper van-icon van-icon-arrow"
              >

              </i>
            </div>

            <div data-v-4f0a6390="" className="action-item logout">
              <div data-v-4f0a6390="" className="action-left" onClick={handleLogout}>

                <img src={"https://img.icons8.com/?size=100&id=IwZ4mbmrC5gw&format=png&color=000000"}
                  className='w-[7rem]'
                />
                <span data-v-4f0a6390="">
                  {t("Đăng xuất")}
                </span>
              </div>
              <i
                data-v-4f0a6390=""
                className="van-badge__wrapper van-icon van-icon-arrow"
              >

              </i>
            </div>


          </div>

        </div>


      </div>

      <InviteFriend
        open={openInvitefriend}
        onClose={() => setOpenInviteFriend(false)}
      />
      <InvestmentStatistics
        openInvestStatistics={openInvestStatistics}
        setOpenInvestStatistics={setOpenInvestStatistics}
      />
      <TeamInvite
        open={openTeam}
        setOpen={setOpenTeam}
      />
      <RecordUserHistoires
        open={openRecord}
        setOpen={setOpenRecord}
      />
      <SecurityCenter
        open={openSecurity}
        setOpen={setOpenSecurity}
      />
    </div>

  )
}

export default Profile