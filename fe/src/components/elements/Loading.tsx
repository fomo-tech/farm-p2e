import React from 'react'
import loading_gif from 'assets/icons/cow.gif'
import { useTranslation } from 'react-i18next'
const Loading = () => {
  const { t } = useTranslation()
  return (
    <div className='fixed  transition-opacity ease-in-out delay-150 duration-300 top-0 left-0 w-full h-screen flex justify-center items-center bg-[rgba(0,0,0,.9)] z-[99999999]'>
      <div>
        <img src={loading_gif} alt='loading_gif' className='w-[150px]' />
        <h4 className='text-[#fff] text-center font-[900]'>{t('please_wait')} ....</h4>
      </div>
    </div>
  )
}

export default Loading