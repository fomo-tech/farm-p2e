import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import banner1 from 'assets/images/banner1.png'
import banner2 from 'assets/images/banner2.png'
import banner3 from 'assets/images/banner3.png'
import requestService from 'api/request';
import { useTranslation } from 'react-i18next';
import NutientBanner from 'components/ui/home/NutientBanner';
// import telegram from 'assets/icons/telegram.png'

import horn from 'assets/images/home_horn_icon.png'
// import clsx from 'clsx';
// import PopupWelcome from 'components/ui/home/PopupWelcome';

import Marquee from 'react-fast-marquee';
import InvestCard from 'components/ui/home/InvestCard';
import { useGlobalAppStore } from 'store/useGlobalApp';
const HomePage = () => {
    const [tickets, setTickets] = useState([])
    const { i18n } = useTranslation();
    const { configApp } = useGlobalAppStore()


    const getTickets = async () => {
        try {
            const res = await requestService.get('/tickets')
            if (res && res.data) {
                setTickets(res.data?.data)
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
    }
    const marqueeText = () => {
        const data = configApp?.HOME_NOTIFICATION && JSON.parse(configApp?.HOME_NOTIFICATION)
        if (i18n?.language === 'vi') return data?.vi
        if (i18n?.language === 'zh') return data?.zh
        return data?.en
    }
    useEffect(() => {
        getTickets()
    }, [])
    return (
        <>
            {/* <PopupWelcome /> */}

            {/* Baner */}

            <div className='h-[42rem] m-[3rem] rounded-lg overflow-hidden'
                style={{
                    boxShadow: "0 .83333rem 3.2rem #64656614"
                }}
            >
                <Swiper className="mySwiper" autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,

                }}
                    loop
                    modules={[Autoplay]}
                >
                    <SwiperSlide>
                        <img src={banner1} alt='banner1' className='object-contain w-full h-full' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <a href='https://t.me/richfarmer_offical' target='_blank'>
                            <img src={banner2} alt='banner1' className='object-contain w-full h-full' />
                        </a>
                    </SwiperSlide>
                    <SwiperSlide className='object-contain w-full h-full'>
                        <img src={banner3} alt='banner1' className='object-contain w-full h-full' />
                    </SwiperSlide>

                </Swiper>
            </div>


            {/* Notice */}

            <div className='notice-bar'>
                <div className='van-notice-bar'>
                    <div className="size-[5rem]">
                        <img src={horn} className='size-[5rem]' />
                    </div>
                    <div className='van-notice-bar__wrap'>

                        <Marquee className='text-[3rem]' gradient={false} pauseOnHover speed={40} delay={1} >
                            {
                                configApp?.HOME_NOTIFICATION &&
                                <div>
                                    <span className='font-[900] text-red-600'>
                                        &nbsp;   &nbsp;  &nbsp;   &nbsp; &nbsp; Thông báo:&nbsp;
                                    </span>
                                        {marqueeText()}
                                </div>
                            }

                        </Marquee>


                    </div>
                </div>
            </div>

            <NutientBanner />

            {/* nft-section */}
            <div className='nft-section pb-[25rem]' data-v-caee1139>
                <div data-v-caee1139="" className="nft-list">
                    {
                        tickets.map((i: any) => (
                            <InvestCard key={i?._id} item={i} />
                        ))
                    }
                </div>
            </div>



        </>
    )
}

export default HomePage