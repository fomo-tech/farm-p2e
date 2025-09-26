import React from 'react'
import loading_gif from 'assets/images/tractor-loader-unscreen.gif'
import { useTranslation } from 'react-i18next'
const LoadingFarm = () => {
    const {t} = useTranslation()
    return (
        <div className='fixed  transition-opacity ease-in-out delay-150 duration-300 top-0 left-0 w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,1)] z-[99999]'>
            <div>
                <img src={loading_gif} alt='loading_gif' className='w-full' />
                <h4 className='text-[#fff] text-center mt-[-20rem]'>{t('please_wait')} ....</h4>
            </div>
        </div>
    )
}

export default LoadingFarm