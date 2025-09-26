import React, { useEffect, useRef, useState } from 'react'
import dolar from 'assets/images/dollar.png'
import home from 'assets/images/home_bottom_icon1.png'
import mission from 'assets/images/home_bottom_icon3.png'
import friend from 'assets/images/home_bottom_icon4.png'
import { useNavigate, useParams } from 'react-router-dom'
import RecordOrders from 'components/ui/RecordOrders'
import bg_num from 'assets/images/home_znzz_bg.png'
import havertIcon from 'assets/images/home_qipao_1.png'
import home_2 from 'assets/images/home_house2.png'
import home_3 from 'assets/images/home_box_image.png'
import requestService from 'api/request'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { notification, Popover } from 'antd'
import { useGlobalAppStore } from 'store/useGlobalApp'
import { useTranslation } from 'react-i18next'
import LoadingFarm from 'components/elements/LoadingFarm'
import { socket } from 'lib/socket'
import { useAuthApp } from 'store/useAuthApp'
import useOrderDetail from 'hooks/useOrderDetail'
import useFloatingMoney from 'hooks/useFloatingMoney'
import useOrderSocket from 'hooks/useOrderSocket'
import { getRecaptchaToken } from 'lib/helpers'
type FloatingItem = {
    id: number;
    amount: number;
};

const Farm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuthApp();
    const { id } = useParams();

    const [openRecord, setOpenRecord] = useState(false)
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    const { handleCallbackUser, handleLoading, loading: loadingScreen } = useGlobalAppStore();

    const { data, loading, setData } = useOrderDetail(id!, user, navigate);
    
    const { items, addMoney } = useFloatingMoney(data?.currentIncome5s);

    useOrderSocket(id!, user?._id, setData);

    const handleHarvest = async () => {
        handleLoading(true)
        try {
            const token = await getRecaptchaToken();
            const res = await requestService.post('/tickets/harvest', {
                data: {
                    orderId: id,
                    recaptchaToken: token
                }
            })
            if (res && res.data) {
                notification.success({
                    message: "Claim success !",
                    duration: 5
                })
                handleCallbackUser()
                socket.emit("fetchOrderDetail", { orderId: id, userId: user?._id });
            }

        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message,
                duration: 5
            })
        } finally {
            setTimeout(() => {
                handleLoading(false)
            }, 1500)

        }

    }

    const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
        if (completed) {
            return <span>{t("Hết hợp đồng")}</span>;
        }

        const pad = (n: number) => String(n).padStart(2, '0');

        return (
            <span>
                {days > 0 ? `${days} ngày` : ''}
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </span>
        );
    };


    useEffect(() => {
        // Mở cái 1, tắt cái 2, rồi đổi luân phiên mỗi 5s
        setOpen1(true);
        setOpen2(false);

        const interval = setInterval(() => {
            setOpen1(prev => !prev);
            setOpen2(prev => !prev);
        }, 3000); // đổi trạng thái mỗi 5 giây

        return () => clearInterval(interval);
    }, []);


    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#fff]  relative">
            {/* {loading && <LoadingFarm />} */}
            <div className="relative w-full h-full">
                <img src={data?.ticket?.desImage} className="w-full h-full m-auto object-cover" />
                {Date.now() < data?.endTime && Date.now() < data?.rewardTime && data?.status && items.map((item) => (
                    <div
                        key={item.id}
                        className="absolute z-[999] top-[45%] text-[20px] left-[45%] -translate-y-1/2 -translate-x-1/2 text-[#fff] font-bold  animate-floatUp select-none pointer-events-none flex gap-2 items-center"
                    >
                        + {item.amount?.toFixed(6)} <img src={dolar} width={20} />
                    </div>
                ))}

                {
                    (Date.now() >= data?.rewardTime || Date.now() >= data?.endTime) && data?.status
                    && !loadingScreen &&
                    <div
                        className="absolute z-[999] top-[48%] text-[20px] left-1/2 -translate-y-1/2 -translate-x-1/2 text-[#fff] font-bold cursor-pointer flex gap-2 items-center"
                        onClick={handleHarvest}
                    >
                        <img src={havertIcon} width={70} />
                    </div>
                }


            </div>
            <div className='absolute bottom-[5%] rounded-tl-[30px] rounded-tr-[30px]  left-0 w-full px-5 flex justify-between items-center'>
                <img src={home} className='size-[100px] cursor-pointer sm:size-[80px]' onClick={() => navigate('/order')} />
                <img src={mission} className='size-[100px] cursor-pointer sm:size-[80px]' onClick={() => setOpenRecord(true)} />
                <img src={friend} className='size-[100px] cursor-pointer sm:size-[80px]' onClick={() => navigate('/agency')} />
            </div>
            <div className='absolute bottom-[25%] right-[15%] cursor-pointer'>
                <Popover trigger={'click'} content={t('HelloTa sẽ đến đây sớm thui')} open={open1}>
                    <img src={home_2} width={100} />
                </Popover>

            </div>
            <div className='absolute bottom-[40%] left-[10%] cursor-pointer'>
                <Popover trigger={'click'} content={t("Sự kiện sắp đến rồi")} open={open2}>
                    <img src={home_3} width={60} />
                </Popover>
            </div>
            <div className='absolute top-[10px] sm:top-[5px] left-0 w-full px-5 flex justify-between items-center'>
                <div className='w-full h-full min-h-[130px] relative'>
                    <img src={bg_num} className='w-full min-h-[150px]' />
                    <div className='absolute w-full h-full left-0 top-0 p-[4rem] text-[15px]'>
                        <div className='flex justify-between items-center mb-3'>
                            <div>{t("Thời gian thuê")}</div>
                            <div className='font-[900]'>
                                {
                                    data && <Countdown
                                        renderer={renderer}
                                        date={data?.endTime}
                                    />
                                }

                            </div>
                        </div>
                        <div className='flex justify-between items-center mb-3'>
                            <div>{t('Thu nhập hiện tại')}</div>
                            <div className='font-[900] text-green-600 flex items-center gap-1'>+ {
                                Number(data?.currentIncome?.toFixed(5))} <img src={dolar} width={20} /></div>

                        </div>
                        <div className='flex justify-between items-center mb-3'>
                            <div>{t("Thời gian thu hoạch")}</div>
                            <div className='font-[900]'>{
                                Date.now() > data?.endTime ? "-" :
                                    new Date(data?.rewardTime)?.toLocaleString()}</div>
                        </div>
                        <div className='flex justify-between items-center mb-3'>

                            <div>{t("Trạng thái thu hoạch")}</div>
                            {
                                Date.now() > data?.endTime ? <span className='font-[900]'>-</span>
                                    :
                                    Date.now() >= data?.rewardTime ?
                                        <div className='font-[900] text-orange-600'>{t("Sẵn sàng thu hoạch")}</div>
                                        :
                                        <div className='font-[900]'>{t("Chưa sẵn sàng")}</div>
                            }

                        </div>

                    </div>
                </div>

            </div>
            <RecordOrders
                open={openRecord}
                setOpen={setOpenRecord}
            />
        </div>
    );
};

export default Farm;
