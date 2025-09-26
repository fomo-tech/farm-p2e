import { Drawer } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import bg from 'assets/images/offline_reward_chart.png'
import { useAuthApp } from 'store/useAuthApp'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'
import vip_0 from 'assets/images/vip-0.png'
import vip_1 from 'assets/images/vip-1.png'
import vip_2 from 'assets/images/vip-2.png'
import vip_3 from 'assets/images/vip-3.png'
import vip_4 from 'assets/images/vip-4.png'
import vip_5 from 'assets/images/vip-5.png'
import clsx from 'clsx'
import GuideInvest from 'locale/component/GuideInvest'
import RecordOrders from './RecordOrders'

interface Props {
  setOpenInvestStatistics: (val: boolean) => void,
  openInvestStatistics: boolean
}

const InvestmentStatistics = ({ openInvestStatistics, setOpenInvestStatistics }: Props) => {
  const { t } = useTranslation()
  const { user } = useAuthApp()
  const [openRecord, setOpenRecord] = useState(false)
  const renderVip = () => {
    switch (user?.farmVip) {
      case 1:
        return vip_1
      case 2:
        return vip_2
      case 3:
        return vip_3
      case 4:
        return vip_4
      case 5:
        return vip_5
      default:
        return vip_0
    }
  }

  return (
    <>

      <RecordOrders
        open={openRecord}
        setOpen={setOpenRecord}
      />
      <Drawer
        title={
          <div className='text-center'>
            {t("Thống kê đầu tư")}
          </div>
        }
        placement={'right'}
        closable={true}
        closeIcon={
          <img src={close_icon} width={50} />
        }
        onClose={() => setOpenInvestStatistics(false)}
        width="100rem"
        open={openInvestStatistics}

      >
        <div data-v-f443897c="" className="vip-page">

          <div data-v-f443897c="" className="vip-header !p-[3rem]" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover", // hoặc "contain", hoặc giá trị bạn muốn
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
            <div data-v-f443897c="" className="vip-card">
              <div data-v-f443897c="" className="vip-info">
                <div data-v-f443897c="" className="current-level">

                  <span data-v-f443897c="" className="level flex items-center gap-4">
                    VIP <img src={renderVip()} className={clsx('size-[35px]', {
                      'size-[45px]': user && user?.farmVip > 0
                    })} />
                  </span>
                </div>
                <div data-v-f443897c="" className="invite-progress !m-0">

                  <div data-v-f443897c="" className="action-buttons">
                    <button
                      data-v-f443897c=""
                      type="button"
                      className="van-button van-button--primary van-button--small !m-0"
                      onClick={() => {
                        setOpenRecord(true)
                        setOpenInvestStatistics(false)
                      }}

                    >
                      <div className="van-button__content">
                        <i className="van-badge__wrapper van-icon van-icon-cash-back van-button__icon">
                          {/**/}
                          {/**/}
                          {/**/}
                        </i>
                        <span className="van-button__text">
                          {t("Lịch sử giao dịch")}
                        </span>
                        {/**/}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div data-v-f443897c="" className="vip-benefits">
                <div data-v-f443897c="" className="benefit-item" style={{
                  padding: "3rem 1rem"
                }}>
                  <span data-v-f443897c="" className="label text-center !text-[12px]">
                    {t("Tổng mua")}
                  </span>
                  <span data-v-f443897c="" className="value !text-[15px]">
                    {Number(user?.totalbuyTicket?.toFixed(2))}
                  </span>

                </div>
                <div data-v-f443897c="" className="benefit-item " style={{
                  padding: "3rem 1rem"
                }}>
                  <span data-v-f443897c="" className="label text-center !text-[12px]">
                    {t("Tổng rút")}
                  </span>
                  <span data-v-f443897c="" className="value !text-[18px]">
                    {Number(user?.totalWithdrawValue?.toFixed(2))}
                  </span>

                </div>
                <div data-v-f443897c="" className="benefit-item" style={{
                  padding: "3rem 1rem"
                }}>
                  <span data-v-f443897c="" className="label text-center !text-[12px]">
                    {t("Lợi nhuận")}
                  </span>
                  <span data-v-f443897c="" className="value !text-[18px]">
                    {Number(user?.totalRewardToday?.toFixed(2))}
                  </span>

                </div>
              </div>
            </div>
          </div>
          <GuideInvest />

        </div>
      </Drawer>
    </>


  )
}

export default InvestmentStatistics