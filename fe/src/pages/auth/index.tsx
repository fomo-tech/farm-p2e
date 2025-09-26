import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import { useTranslation } from 'react-i18next'
import { DrawerLang } from 'components/ui/DrawerLang'

const Auth = () => {
  const { pathname, } = useLocation()
  const [openLang, setOpenLang] = useState(false)
  return (
    <>

      <div data-v-daf86cc3="" className="auth-page relative">
        <div className='absolute right-2 top-1 w-[8rem] h-[8rem] flex justify-center items-center rounded-full '
        >

          <DrawerLang
            openLang={openLang}
            setOpenLang={setOpenLang}
            showLangSelected
          />

        </div>

        <div data-v-daf86cc3="" className="auth-container">

          {
            pathname === '/register' &&
            <Register />
          }
          {
            pathname === '/login' &&
            <Login />

          }

        </div>
      </div>
    </>


  )
}

export default Auth