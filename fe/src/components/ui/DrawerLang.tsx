import { Drawer } from 'antd'
import clsx from 'clsx';
import React from 'react'
import { useTranslation } from 'react-i18next';
import close_icon from 'assets/img_custom/clolor_dialog_close.png'

interface Props {
  setOpenLang: (val: boolean) => void,
  openLang: boolean,
  showLangSelected?: boolean
}

const langOptions: Record<string, { label: string; icon: string }> = {
  en: {
    label: 'English',
    icon: 'https://img.icons8.com/?size=100&id=NvYRxC2UBsLO&format=png&color=000000'
  },
  vi: {
    label: 'Vietnamese',
    icon: 'https://img.icons8.com/?size=100&id=2egPD0I7yi4-&format=png&color=000000'
  },
  zh: {
    label: '中文',
    icon: 'https://img.icons8.com/?size=100&id=Ej50Oe3crXwF&format=png&color=000000'
  }
};


export const DrawerLang = ({ openLang, setOpenLang, showLangSelected }: Props) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const handleChangeLang = (lang: string) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
    setOpenLang(false)
  }

  return (

    <>
      {showLangSelected && (
        <img src={langOptions[currentLang]?.icon} width={30} onClick={() => setOpenLang(true)} />
      )}

      <Drawer
        title={
          <div className='text-center'>
            {t("lang")}
          </div>
        }
        placement={'right'}
        closable={true}
        closeIcon={
          <img src={close_icon} width={50} />
        }
        onClose={() => setOpenLang(false)}
        width="100rem"
        open={openLang}
      >
        <div data-v-10ae50da className='page-content'>
          <div data-v-10ae50da="" className="language-list">
            <div
              data-v-10ae50da=""
              className={clsx("van-cell van-cell--clickable ", {
                'active': i18n.language === 'en'
              })}
              role="button"
              tabIndex={0}
              onClick={() => handleChangeLang('en')}
            >
              <img src="https://img.icons8.com/?size=100&id=NvYRxC2UBsLO&format=png&color=000000" width={40} />
              <div className="van-cell__title ml-3">
                <span data-v-10ae50da="" className="lang-name">
                  English
                </span>
                {/**/}
              </div>
              {/**/}
              {/**/}
              {/**/}
            </div>
            <div
              data-v-10ae50da=""
              className={clsx("van-cell van-cell--clickable ", {
                'active': i18n.language === 'vi'
              })}
              role="button"
              tabIndex={0}
              onClick={() => handleChangeLang('vi')}
            >
              <img src="https://img.icons8.com/?size=100&id=2egPD0I7yi4-&format=png&color=000000" width={40} />
              <div className="van-cell__title ml-3">
                <span data-v-10ae50da="" className="lang-name">
                  Vietnamese
                </span>
                {/**/}
              </div>
              {/**/}
              <i
                data-v-10ae50da=""
                className="van-badge__wrapper van-icon van-icon-success check-icon"
              >
                {/**/}
                {/**/}
                {/**/}
              </i>
              {/**/}
            </div>
            <div
              data-v-10ae50da=""
              className={clsx("van-cell van-cell--clickable ", {
                'active': i18n.language === 'zh'
              })}
              role="button"
              tabIndex={0}
              onClick={() => handleChangeLang('zh')}
            >
              <img src="https://img.icons8.com/?size=100&id=Ej50Oe3crXwF&format=png&color=000000" width={40} />
              <div className="van-cell__title ml-3">
                <span data-v-10ae50da="" className="lang-name">
                  中文
                </span>
                {/**/}
              </div>
              {/**/}
              {/**/}
              {/**/}
            </div>

          </div>
        </div>
      </Drawer>
    </>
  )
}
