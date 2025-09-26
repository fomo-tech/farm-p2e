import React, { useState } from 'react'
import activity1 from 'assets/images/call.png'
import activity2 from 'assets/images/activity2.jpg'
import { useTranslation } from 'react-i18next'
import j123 from 'assets/images/j123.webp'
import j124 from 'assets/images/j124.webp'
import j126 from 'assets/images/j124.webp'
import { useNavigate } from 'react-router-dom'
import luckydraw from 'assets/images/interactiveadvertising_task4.png'
import j120 from 'assets/images/j120.webp'
import j127 from 'assets/images/j127.webp'
import j121 from 'assets/images/j121.webp'
import Countdown from 'react-countdown'

// import activity3 from 'assets/images/658138687ef751702967400.png'
// import rw3 from 'assets/icons/duck.png'

const getNextMonday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (8 - day) % 7 || 7; // số ngày đến thứ 2 kế tiếp
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + diff);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
};

const Activity = () => {
    const { t } = useTranslation()
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const navigate = useNavigate()





    function getTimeLeft() {
        const now = new Date();
        const nextMonday = getNextMonday();
        const diff = nextMonday.getTime() - now.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return { days, hours, minutes, seconds };
    }

    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
            return <span>Pending...</span>;
        } else {
            return (
                <span>
                    {days}d {hours}h {minutes}m {seconds}s
                </span>
            );
        }
    };


    return (

        <div data-v-0d43561f="" className="activity-list h-screen  pt-[5rem] pb-[25rem] flex flex-col gap-[10px] px-[10px]">
            <div className='w-full h-[150px] relative px-[24px] flex  items-center cursor-pointer'>
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img src={j127} className='w-full h-full' />
                </div>
                <div className='absolute top-0 right-0 justify-center px-[10px] min-w-[70px] text-[14px] font-[900] text-[#fff] flex gap-2 items-center h-[27px] bg-[#cc1c1c]' style={{
                    borderRadius: "0px 14px 0px 14px"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[20px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    <Countdown date={getNextMonday()} renderer={renderer} />
                </div>
                <div className='flex z-20 items-center gap-[10px] cursor-pointer'>
                    <img src={j120} className='w-[84px]' />
                    <div className='p-[15px] rounded-[25px]' style={{
                        backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 100%, .2), hsla(0, 0%, 100%, 0))"
                    }}>
                        <div className='text-[#fff] font-[900]'>
                            {t("Hộp may mắn")}
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[150px] relative px-[24px] flex  items-center cursor-pointer'
                onClick={() => navigate('/lucky-draw')}
            >
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img src={j126} className='w-full h-full' />
                </div>
                <div className='absolute top-0 right-0 justify-center w-[70px] text-[14px] font-[900] text-[#fff] flex gap-2 items-center h-[27px] bg-[#cc1c1c]' style={{
                    borderRadius: "0px 14px 0px 14px"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[20px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                    HOT
                </div>
                <div className='flex z-20 items-center gap-[10px] cursor-pointer'>
                    <img src={luckydraw} className='w-[84px]' />
                    <div className='p-[15px] rounded-[25px]' style={{
                        backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 100%, .2), hsla(0, 0%, 100%, 0))"
                    }}>
                        <div className='text-[#fff] font-[900]'>
                            {t("Vòng xoay may mắn")}
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[160px] relative px-[24px] flex  items-center cursor-pointer'
                onClick={() => navigate('/daily-checkin')}
            >
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img src={j123} className='w-full h-full' />
                </div>
                <div className='absolute top-0 right-0 justify-center w-[70px] text-[14px] font-[900] text-[#fff] flex gap-2 items-center h-[27px] bg-[#cc1c1c]' style={{
                    borderRadius: "0px 14px 0px 14px"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[20px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                    HOT
                </div>
                <div className='flex z-20 items-center gap-[10px] cursor-pointer'>
                    <img src={activity1} className='w-[84px]' />
                    <div className='p-[15px] rounded-[25px]' style={{
                        backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 100%, .2), hsla(0, 0%, 100%, 0))"
                    }}>
                        <div className='text-[#fff] font-[900]'>
                            {t("Điểm danh hàng ngày")}
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[150px] relative px-[24px] flex  items-center cursor-pointer'
                onClick={() => navigate('/agency')}

            >
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img src={j124} className='w-full h-full' />
                </div>

                <div className='flex z-20 items-center gap-[10px] cursor-pointer'>
                    <img src={activity2} className='w-[84px]' />
                    <div className='p-[15px] rounded-[25px]' style={{
                        backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 100%, .2), hsla(0, 0%, 100%, 0))"
                    }}>
                        <div className='text-[#fff] font-[900]'>
                            {t("Mời bạn bè")}
                        </div>
                    </div>
                </div>
            </div>


            <div className='w-full h-[150px] relative px-[24px] flex  items-center cursor-pointer'>
                <div className='absolute top-0 left-0 w-full h-full'>
                    <img src={j127} className='w-full h-full' />
                </div>
                <div className='absolute top-0 right-0 justify-center px-[10px] min-w-[70px] text-[14px] font-[900] text-[#fff] flex gap-2 items-center h-[27px] bg-[#cc1c1c]' style={{
                    borderRadius: "0px 14px 0px 14px"
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[20px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    Coming soon
                </div>
                <div className='flex z-20 items-center gap-[10px] cursor-pointer'>
                    <img src={j121} className='w-[84px]' />
                    <div className='p-[15px] rounded-[25px]' style={{
                        backgroundImage: "linear-gradient(90deg, hsla(0, 0%, 100%, .2), hsla(0, 0%, 100%, 0))"
                    }}>
                        <div className='text-[#fff] font-[900]'>
                            {t("Ai bay xa hơn")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Activity