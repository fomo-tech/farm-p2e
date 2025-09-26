
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useAuthApp } from 'store/useAuthApp'
import { useGlobalAppStore } from 'store/useGlobalApp'
import vip_0 from 'assets/images/vip-0.png'
import vip_1 from 'assets/images/vip-1.png'
import vip_2 from 'assets/images/vip-2.png'
import vip_3 from 'assets/images/vip-3.png'
import vip_4 from 'assets/images/vip-4.png'
import vip_5 from 'assets/images/vip-5.png'

const VipFarmReward = () => {
  const { t } = useTranslation()
  const { user } = useAuthApp()
  const { configApp, handleCallbackUser } = useGlobalAppStore()


  const arrayVip = configApp ? Object.entries(configApp?.farmVip)?.map(([key, value]: any) => ({
    level: key,
    ...value,
  })) : [];

  const renderVip = (vip: number) => {
    switch (vip) {
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
    <div data-v-0c054b6c="" className="page-content pb-[10rem]">
      <div data-v-0c054b6c="" className="current-level  !items-center !py-2">
        <div data-v-0c054b6c="" className="level-info  items-center justify-center">

          <span data-v-0c054b6c="" className="value flex items-center gap-4 ">
            VIP <img src={renderVip(user?.farmVip || 0)} className={clsx('size-[30px]', {
              'size-[45px]': user && user?.farmVip > 0
            })} />
          </span>
        </div>
        <div data-v-0c054b6c="" className="level-icon text-[20px] ">
          {t("Tổng nạp")}: <span className='font-[800]'>{Number(user?.totalDep?.toFixed(2))}$</span>
        </div>
      </div>
      <div data-v-0c054b6c="" className="salary-list">
        {
          arrayVip?.map((i: any, idx: number) => (
            <div data-v-0c054b6c="" className={clsx("salary-item ", {
              "active": user && user.vip >= 0
            })} key={idx} >
              <div data-v-0c054b6c="" className="item-content !justify-between ">
                <div data-v-0c054b6c="" className="level-badge !bg-none !shadow-none !w-[17rem]">
                  <span data-v-0c054b6c="" className="badge-text flex items-center gap-4 !text-[#aaa] !font-[900]">
                    VIP  <img src={renderVip(Number(i?.level))} className={clsx('size-[35px]')} />
                  </span>
                </div>
                <div data-v-0c054b6c="" className="salary-info ">
                  <div data-v-0c054b6c="" className="amount !justify-start">
                    <span data-v-0c054b6c="" className="value !text-[12px]">
                      {i?.profitPercent * 10}% {t("thu hoạch")}
                    </span>

                  </div>
                  <div data-v-0c054b6c="" className="amount !justify-start">
                    <span data-v-0c054b6c="" className="value !text-[12px]">
                      +{i?.activityPlus
                      } {t("lượt miễn phí")}
                    </span>
                    <span data-v-0c054b6c="" className="unit">
                      /{t("ngày")}
                    </span>
                  </div>
                  {/* <div data-v-0c054b6c="" className="amount !justify-start">
                    <span data-v-0c054b6c="" className="value !text-[12px]">
                      Gi 1% {t("rút tiền")}
                    </span>

                  </div> */}
                </div>

              </div>
              <div data-v-0c054b6c="" className="progress-bar">
                <div data-v-0c054b6c="" className="progress-info">
                  <span data-v-0c054b6c="" className="progress-text">
                    {t("Tiến độ")}
                  </span>
                  <span data-v-0c054b6c="" className="progress-numbers">
                    {i?.totalDep}$
                  </span>
                </div>
                <div data-v-0c054b6c="" className="progress-track">
                  <div
                    data-v-0c054b6c=""
                    className="progress-fill"
                    style={{ width: user ? user?.totalDep * 100 / i?.totalDep + "%" : 0 }}
                  />
                </div>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default VipFarmReward