import React, { useTransition } from 'react'
import { useTranslation } from 'react-i18next'

const Ranking = () => {
  const { t } = useTranslation()
  return (
    <div className='text-[12px] text-[#000]  z-50 relative h-[250px] flex flex-col justify-center'>
      <p className="text-center text-black text-[15px]">
        {t("Sự kiện chưa diễn ra")} !
      </p>


    </div>
  )
}

export default Ranking