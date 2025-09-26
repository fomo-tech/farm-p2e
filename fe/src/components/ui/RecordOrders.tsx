import { Drawer } from 'antd'
import requestService from 'api/request'
import clsx from 'clsx'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TRANSACTION_TYPE_REFUND_TICKET, TRANSACTION_TYPE_UNLOCK_LAND } from 'constants/define'
import { useAuthApp } from 'store/useAuthApp'
interface Props {
  setOpen: (val: boolean) => void,
  open: boolean
}
const RecordOrders = ({ open, setOpen }: Props) => {
  const [data, setData] = useState([])
  const { user } = useAuthApp()
  const { t } = useTranslation()
  const getRewards = async () => {
    if (user?.realBalance)
      try {
        const res = await requestService.get('/tickets/order-reward')
        if (res && res.data) {
          setData(res?.data?.data)
        }
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
      }
  }

  useEffect(() => {
    getRewards()
  }, [user?.realBalance])

  return <Drawer
    title={
      <div className='text-center'>
        {t("Lịch sử giao dịch")}
      </div>
    }
    placement={'right'}
    closable={true}
    closeIcon={
      <img src={close_icon} width={50} />
    }
    onClose={() => setOpen(false)}
    width="100rem"
    open={open}
    zIndex={999999}
  >
    <div data-v-08b1e8b3="" className="records-list">
      {
        data?.length > 0 &&
        data?.map((i: any) => (
          <div data-v-08b1e8b3 className='record-item flex items-center' key={i?._id}>
            <div data-v-08b1e8b3 className='record-left'>
              <div data-v-08b1e8b3 className='record-time !text-[15px]'>
                {new Date(i?.createdAt)?.toLocaleString()}
              </div>
              <div data-v-08b1e8b3 className='record-balance flex !items-center'>
                <div data-v-08b1e8b3 className='label !text-[15px]'>
                  {t("Số dư")} :
                </div>
                <div data-v-08b1e8b3 className='value !text-[17px]'>
                  {Number(i?.currentBalanceUser?.toFixed(3))}
                </div>
                <div data-v-08b1e8b3 className='currency items-center flex h-full'>
                  <img src={"/icons/diamond-icon.svg"} width={20} />
                </div>
              </div>
            </div>
            <div data-v-08b1e8b3 className='record-right'>
              <div data-v-08b1e8b3 className={clsx('record-amount  flex items-center', {
                "income": i?.transaction_type === 'reward_ticket'
              })}>
                <div data-v-08b1e8b3 className='amount'>
                  {i?.value > 0 ? "+" : ""} {Number(i?.value?.toFixed(3))}
                </div>
                <div data-v-08b1e8b3 className='currency'>
                  <img src={"/icons/diamond-icon.svg"} width={20} />
                </div>
              </div>
              <div data-v-08b1e8b3 className='record-reason'>
                {
                  i?.transaction_type === 'reward_ticket' && t("Cộng tiền phân phối")
                }
                {
                  i?.transaction_type === 'buy_ticket' && t("Mua ticket")
                }
                {
                  i?.transaction_type === TRANSACTION_TYPE_REFUND_TICKET && t("refun ticket")
                }
                {
                  i?.transaction_type === TRANSACTION_TYPE_UNLOCK_LAND && t("unlock_land")
                }
              </div>
            </div>
          </div>
        ))
      }
      {
        data?.length == 0 &&
        <div data-v-08b1e8b3="" role="feed" className="van-list" aria-busy="false">

          <div className="van-list__finished-text text-center">
            {t("Không có dữ liệu")}
          </div>

          <div className="van-list__placeholder" />
        </div>
      }

    </div>

  </Drawer>
}

export default RecordOrders