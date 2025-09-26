import React, { useState } from 'react'
import from_wood from 'assets/images/farm_wooden.png'
import timeEndIcon from 'assets/images/task_item_icon5.png'
import dolar from 'assets/images/dollar.png'
import { useTranslation } from 'react-i18next'
import { Drawer, Modal, notification } from 'antd'
import { useGlobalAppStore } from 'store/useGlobalApp'
import requestService from 'api/request'
import useBreakpoint from 'hooks/useBreakpoint'
import guide_icon from 'assets/images/me_feedback_detailed_icon.png'
import info_icon from 'assets/images/home_tx_icon.png'
import TextRentFarm from 'locale/component/TextRentFarm'
import { useNavigate } from 'react-router-dom'
import close_icon from 'assets/images/home_dialog_close.png'
const InvestCard = ({ item }: { item: any }) => {
    const { t } = useTranslation()
    const breakpoint = useBreakpoint()
    const [openConfirm, setOpenConfirm] = useState<any>(false)
    const [showInfo, setShowInfo] = useState(false)
    const [openGuide, setOpenGuide] = useState(false)
    const { loading, handleLoading, handleCallbackUser } = useGlobalAppStore()
    const navigate = useNavigate()

    const handleBuyTicket = async (ticketId: string) => {
        handleLoading(true)
        try {
            const res = await requestService.post('/tickets', {
                data: {
                    ticketId
                }
            })
            if (res && res.data) {
                notification.success({
                    message: res.data?.message,
                    duration: 3
                })
                handleCallbackUser()
                setOpenConfirm(false)
                navigate('/order')
            }
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message,
                duration: 3
            })
            setOpenConfirm(false)
        }
        handleLoading(false)
    }

    return (
        <>
            <div data-v-caee1139="" className="nft-card relative">
                <div data-v-caee1139="" className="nft-image">
                    <div data-v-caee1139="" className="van-image ">
                        <img
                            src={item?.urlImage}
                            alt="Vé vàng NFT"
                            className="van-image__img !h-full !w-full"
                            style={{ objectFit: "cover" }}

                        />

                    </div>
                    <div data-v-caee1139="" className="nft-badges">
                        <div data-v-caee1139="" className="new" />
                    </div>
                    <div data-v-caee1139="" className="nft-tags flex flex-col gap-1 !left-[10px]">

                        <div data-v-caee1139="" className="text-[#fff] font-[900]  tag-item restrict-tag flex items-center gap-2 text-[17px] ">

                            <img src={timeEndIcon} width={30} className='flip-hourglass' />
                            {item?.earningDay} {t("home.day")} {/**/}
                        </div>
                        <div data-v-caee1139="" className="text-[#fff] font-[900] tag-item restrict-tag flex items-center gap-2 text-[17px] ">

                            <img src={dolar} width={30} className='flip-hourglass' />
                            {item?.price}
                        </div>

                    </div>
                    <div className='absolute bottom-[10px] left-[8px] cursor-pointer'>
                        <img src={from_wood} width={100} />
                    </div>
                    <div className='absolute bottom-[80px] text-[#fff] text-[12px] font-[900] left-[26px]'
                        onClick={() => setOpenConfirm(true)}
                    >
                        {t("Thuê ngay")}
                    </div>
                    <div className='absolute top-[10px] text-[13px] z-[20] font-[900] right-[10px] flex gap-3 items-center cursor-pointer'

                    >
                        <img src={info_icon}
                            width={35}
                            onClick={() => setShowInfo(true)}
                        />
                        <img src={guide_icon}
                            width={30}
                            onClick={() => setOpenGuide(true)}
                        />
                    </div>
                </div>

            </div>
            <Modal
                closeIcon={<img src={close_icon} />}
                title={t("Hợp đồng thuê trang trại")} open={openGuide} centered footer={null} width={400} onCancel={() => setOpenGuide(false)}>
                {
                    item && <TextRentFarm item={item} />
                }
                <div className='my-3'
                    onClick={() => {
                        setOpenGuide(false)
                        setOpenConfirm(true)
                    }}
                >
                    <button className='btn-rent w-full'>{t("Thuê ngay")}</button>
                </div>
            </Modal>
            <Drawer
            
                className='modal-confirm-buy'
                placement={breakpoint === 'mobile' ? 'bottom' : "left"}
                height={"auto"}
                closable={false}
                onClose={() => setShowInfo(false)}
                zIndex={99999}
                title={
                    <div className='flex justify-between'>
                        <div className='text-center font-[900] text-[3.5rem] flex items-center gap-2'>


                            {t("Thông tin trang trại")}
                        </div>
                        <button className='text-yellow-700 underline text-[3rem] font-[500]'
                            onClick={() => setShowInfo(false)}
                        >
                            <img src={close_icon} width={30} />

                        </button>

                    </div>
                }
                open={showInfo}
            >
                <div className='flex items-center justify-between mb-[3rem] text-[16px]'>
                    <h3>{t("Tên trang trại")}</h3>
                    <div className='font-[900]'>
                        {item?.name}
                    </div>

                </div>
                <div className='flex items-center justify-between mb-[3rem] text-[16px]'>
                    <h3>{t("Thời gian thuê")}</h3>
                    <div className='font-[900]'>
                        {item?.earningDay} {t('home.day')}
                    </div>
                </div>
                <div className='flex items-center justify-between mb-[3rem] text-[16px] '>
                    <h3>{t("Thu nhập mỗi ngày")}</h3>
                    <div className='font-[900] flex items-center gap-2'>
                        +{item?.incomePerDay}   <img src={dolar} width={20} />
                    </div>

                </div>
                <div className='flex items-center justify-between mb-[3rem] text-[16px] '>
                    <h3>{t("Giá thuê")}</h3>
                    <div className='font-[900] flex items-center gap-2'>
                        {item?.price}   <img src={dolar} width={20} />
                    </div>

                </div>
                <div className='flex items-center justify-between mb-[3rem] text-[16px] '>
                    <h3>{t("Tổng thu nhập")}</h3>
                    <div className='font-[900] flex items-center gap-2'>
                        ≈ {item?.incomePerDay * item?.earningDay}   <img src={dolar} width={20} />
                    </div>

                </div>

                <div className='mb-[3rem] text-[16px] '>
                    <h3 className='text-red-600 font-[900]'>
                        {t("Lưu ý")}:
                        <span className='text-[#000]'>
                            {" "} {t("Bạn có thể huỷ thuê trang trại bất kì lúc nào. Bạn sẽ nhận lại được 10% tiền thuê")}
                        </span>
                    </h3>
                </div>
                <div className='mb-[3rem] text-[16px] '>
                    <button className='btn-rent w-full' onClick={() => {
                        setShowInfo(false)
                        setOpenConfirm(true)
                    }}>
                        {t("Thuê ngay")}
                    </button>
                </div>
            </Drawer>
            <Drawer
            
                className='modal-confirm-buy'
                placement={breakpoint === 'mobile' ? 'bottom' : "left"}
                height={"auto"}
                closable={false}
                onClose={() => setOpenConfirm(false)}
                zIndex={9999}
                title={
                    <div className='flex justify-between'>
                        <div className='text-center font-[900] text-[3.5rem]'>
                            {t("Xác nhận")}
                        </div>
                        <button className='text-yellow-700 underline text-[3rem] font-[500]'
                            onClick={() => {
                                setOpenConfirm(false)

                            }}
                        >
                            <img src={close_icon} width={30} />
                        </button>

                    </div>
                }
                open={openConfirm}
            >
                <div className='flex flex-col gap-2 rem-3 my-[20px]'>
                    <h3 className='text-center text-[16px] font-[700]'>{t("Bạn xác nhận thuê trang trại này với giá")}
                        <span className='text-red-600'> {item?.price}$</span> {t("trong")}
                        <span className='text-orange-600'> {item?.earningDay} {t("ngày")}</span>  ?</h3>
                </div>
                <div className='flex w-full items-center justify-between py-4'>

                    <button className='btn-rent w-full'
                        onClick={() => handleBuyTicket(item)}
                        disabled={loading}
                    >{t("Xác nhận")}</button>
                </div>
            </Drawer>
        </>

    )
}

export default InvestCard