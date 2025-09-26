import React from 'react'
import bg_farm from 'assets/img_custom/home_image_bg.9.png'
import HomFarm from './components/HomeFarm'
import NoticeBar from 'components/ui/home/NoticeBar'

const Home = () => {
  return (
    <>
      <NoticeBar />
      <div style={{
        background: `url(${bg_farm})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: "cover"
      }} className='w-full h-screen relative overflow-hidden'>
        <div className='absolute max-w-[400px] w-full left-1/2 top-1/2 translate-x-[-50%]  translate-y-[-50%]'>
          <div className="w-full max-w-[400px] mx-auto aspect-square relative overflow-visible">
            <HomFarm />
          </div>
        </div>
      </div>


    </>

  )
}

export default Home