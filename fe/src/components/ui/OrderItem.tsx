import React, { useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import icon_1 from 'assets/images/me_icon_6.png'
import { useTranslation } from 'react-i18next'
import bg_23 from 'assets/images/23.webp'
import dolar from 'assets/images/dollar.png'
import { Modal, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import requestService from 'api/request'
import { useGlobalAppStore } from 'store/useGlobalApp'
const OrderItem = ({ i, setIsCallBack }: { i: any, setIsCallBack: () => void }) => {
    const [openInfoOrder, setOpenInfoOrder] = useState(false)
    const { handleLoading,handleCallbackUser } = useGlobalAppStore()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (completed) {
            return <span>{t("Đã kết thúc")}</span>;
        }

        const pad = (n: number) => String(n).padStart(2, '0');

        return (
            <span>
                {days > 0 ? `${days} ngày ` : ''}
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
        );
    };

    const handleCancelFarm = async () => {
        handleLoading(true)
        try {
            const res = await requestService.post("/tickets/cancel", {
                data: {
                    orderId: i?._id
                }
            })
            if (res && res.data) {
                notification.success({
                    message: "Cancel order success",
                    duration: 3
                })
                setIsCallBack()
                setOpenInfoOrder(false)
                handleCallbackUser()
            }
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message,
                duration: 3
            })
        }
        handleLoading(false)
    }
    return (
        <div

            data-v-a5db015c=""
            data-v-5fcece6c=""
            className="bg-[#ccc] w-full h-[167px] rounded-[10px] p-[10px] flex justify-between mb-[15px] relative"

        >
            <Modal open={openInfoOrder} footer={null} centered title={t("Thông tin trang trại")}
                onCancel={() => setOpenInfoOrder(false)}
            >
                <div className='mb-5'>
                    {t("content_order_item", {
                        name: i?.ticket?.name,
                        date: new Date(i?.endTime)?.toLocaleString()
                    })}
                </div>
                {
                    Date.now() < i?.endTime &&

                    <div className='flex justify-end'>
                        <button className='bg-red-600 text-[#fff] min-w-[150px] p-[1rem] rounded-[10px]'
                            onClick={() => handleCancelFarm()}
                        >Huỷ</button>
                    </div>
                }

            </Modal>
            <div className='absolute z-[99] top-[5px] left-[5px] cursor-pointer'
                onClick={() => setOpenInfoOrder(true)}
            >
                <img src={icon_1} width={30} />
            </div>
            <div
                className="rounded-[10px] absolute inset-0 bg-no-repeat bg-[length:100%] bg-[position:0%_80%] z-0  opacity-[.8] "
                style={{
                    backgroundImage: `url(${i?.ticket?.urlImage})`,
                }}
            />
            <div data-v-a5db015c="" className="flex flex-col  z-10 justify-center items-center">
                <div data-v-a5db015c="" className="font-[700]">
                    <div data-v-a5db015c="">
                        <div data-v-a5db015c="" className="text-[20px] font-[900] text-[#fff] mr-[7px] mt-[11px]">
                            {i?.ticket?.name}
                        </div>
                        <div data-v-a5db015c="" className="mt-[9px] text-[17px] text-[#fff]">
                            <Countdown
                                renderer={renderer}
                                date={i?.endTime}
                            />
                        </div>
                    </div>
                </div>

            </div>
            <div data-v-a5db015c="" className="flex flex-col justify-evenly w-[184px] h-full z-10"
                style={{
                    background: `url(${bg_23}) no-repeat`,
                    backgroundSize: "100% 100%"
                }}
            >
                <div data-v-a5db015c="" className="text-[15px text-[#999] ml-[32px]">
                    {t("Tổng thu hoạch")}
                </div>
                <div data-v-a5db015c=""
                    style={{
                        alignSelf: 'center',
                        padding: '0 19px 0 32px'
                    }} className='flex gap-2 items-center'
                >
                    <div
                        data-v-278ee21a=""
                        data-v-a5db015c=""
                        className='flex gap-2 items-center'
                    >


                        <p
                            data-v-278ee21a=""
                            className="u-icon__label"
                            style={{
                                color: "rgb(51, 51, 51)",
                                fontSize: 20,
                                margin: "0px 0px 0px 5px"
                            }}
                        >
                            <span>{Number(i?.totalEarn?.toFixed(5))}</span>
                        </p>
                        <div
                            data-v-278ee21a=""
                            className="u-icon__img"
                            style={{ width: 34, height: 34 }}
                        >
                            <img src={dolar} draggable="false" />

                        </div>
                    </div>
                </div>
                <div data-v-a5db015c="" className="ml-[32px]">
                    <button className='w-[138px] h-[36px] rounded-[10px] text-[15px] text-[#fff] font-[800]' style={{
                        background: "linear-gradient(90deg, #0ca66b, #0a98a7)"
                    }}
                        onClick={() => navigate('/farm/' + i?._id)}
                    >
                        {t("Thăm")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderItem