import { Drawer, Tabs, Tag } from 'antd'
import requestService from 'api/request'
import clsx from 'clsx'
import { formatNumber } from 'lib/helpers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import close_icon from 'assets/img_custom/clolor_dialog_close.png'

import {
  TRANSACTION_STATUS_CANCEL,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_TYPE_DEPOSIT
} from 'constants/define'

interface Props {
  setOpen: (val: boolean) => void,
  open: boolean
}

const RecordUserHistoires = ({ open, setOpen }: Props) => {
  const [data, setData] = useState([])
  const [transactionType, setTransactionType] = useState('deposit')
  const { t } = useTranslation()

  const getHistory = async () => {
    try {
      const res = await requestService.get('/profile/history-user', {
        params: {
          transaction_type: transactionType
        }
      })
      if (res?.data) {
        setData(res.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const renderStatus = (status: string) => {
    if (status === TRANSACTION_STATUS_PENDING) return t("Đang chờ")
    if (status === TRANSACTION_STATUS_CANCEL) {
      return transactionType === TRANSACTION_TYPE_DEPOSIT ? t("Không thành công") : t("Bị từ chối")
    }
    return t("Đã giải quyết")
  }

  const renderTransactionLabel = (type: string) => {
    switch (type) {
      case 'deposit': return t("Nạp tiền")
      case 'withdraw': return t("Rút tiền")
      case 'reward_refferal': return t("Thưởng giới thiệu")
      case 'reward_draw': return t("Vòng quay may mắn")
      case 'reward_mine': return t("Đi tìm kho báu")
      case 'LIXI_MOI_NGAY': return t("Lì xì")
      case 'reward_vip': return t("Nhận thưởng đại lý")
      case 'checkin': return t("Điểm danh")
      default: return type
    }
  }

  useEffect(() => {
    getHistory()
  }, [transactionType])

  return (
    <Drawer
      title={<div className='text-center'>{t("Lịch sử giao dịch")}</div>}
      placement="right"
      closable
      closeIcon={<img src={close_icon} width={50} />}
      onClose={() => setOpen(false)}
      width="100rem"
      open={open}
    >
      <Tabs
        defaultActiveKey="deposit"
        className='tab-record'
        size='large'
        centered
        onChange={(key) => {
          setData([])
          setTransactionType(key)
        }}
        items={[
          { key: "deposit", label: t("home.deposit") },
          { key: "withdraw", label: t("home.withdraw") },
          { key: "reward", label: t("Thưởng") }
        ]}
      />

      <div data-v-08b1e8b3="" className="records-list">
        {data.length > 0 ? (
          data.map((i: any) => (
            <div data-v-08b1e8b3="" className='record-item flex items-center relative' key={i._id}>
              <div data-v-08b1e8b3="" className='absolute left-0 top-[-1rem]'>
                {i.transaction_type !== 'reward_refferal' && (
                  <Tag
                    data-v-08b1e8b3="" className='uppercase rounded-2xl'
                    color={
                      i.transaction_status === 'finish'
                        ? "green-inverse"
                        : i.transaction_status === 'pending'
                          ? "orange-inverse"
                          : 'red-inverse'
                    }
                  >
                    {renderStatus(i.transaction_status)}
                  </Tag>
                )}
              </div>

              <div data-v-08b1e8b3="" className='record-left'>
                <div data-v-08b1e8b3="" className='record-time !text-[12px]'>
                  {new Date(i.createdAt).toLocaleString()}
                </div>
                <div data-v-08b1e8b3="" className='record-balance !items-center'>
                  <div data-v-08b1e8b3="" className='label !text-[12px]'>{t("Số dư")}:</div>
                  <div data-v-08b1e8b3="" className='value !text-[12px]'>
                    {formatNumber(Number(i.currentBalanceUser?.toFixed(3)))}
                  </div>
                  <div data-v-08b1e8b3="" className='currency'>
                    <img src={"/icons/diamond-icon.svg"} width={20} />
                  </div>
                </div>
              </div>

              <div data-v-08b1e8b3="" className='record-right'>
                <div data-v-08b1e8b3="" className={clsx('record-amount flex items-center', {
                  income: i.transaction_type === 'reward_ticket'
                })}>
                  <div data-v-08b1e8b3="" className='amount !text-[17px]'>
                    {i.value > 0 ? "+" : ""}{Number(i.value?.toFixed(3))}
                  </div>
                  <div data-v-08b1e8b3="" className='currency'>
                    <img src={"/icons/diamond-icon.svg"} width={20} />
                  </div>
                </div>

                <div data-v-08b1e8b3="" className='record-reason'>
                  {renderTransactionLabel(i.transaction_type)}
                </div>

                {i.reason && (
                  <div data-v-08b1e8b3="" className='text-red-500'>
                    Lý do: {" "}
                    {i.reason}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div data-v-08b1e8b3="" className="van-list text-center">
            <div data-v-08b1e8b3="" className="van-list__finished-text">{t("Không có dữ liệu")}</div>
            <div data-v-08b1e8b3="" className="van-list__placeholder" />
          </div>
        )}
      </div>
    </Drawer>
  )
}

export default RecordUserHistoires
