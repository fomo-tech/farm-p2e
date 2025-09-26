import { message } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useAuthApp } from 'store/useAuthApp';
import InviteFriend from '../InviteFriend';
import icon from 'assets/images/j118.webp'
import { useNavigate } from 'react-router-dom';
const NutientBanner = () => {
    const { user } = useAuthApp()
    const { t, i18n } = useTranslation();
    const navigate= useNavigate()
    return (
        <>
          
            <div data-v-caee1139="" className="nutrient-banner" onClick={()=>navigate('/order')}>
                <div data-v-caee1139="" className="nutrient-content">
                    <div data-v-caee1139="" className="nutrient-icon">
                        <img
                            data-v-caee1139=""
                            src={icon}
                            alt="营养液"
                        />
                    </div>
                    <div data-v-caee1139="" className="nutrient-info">
                        <div data-v-caee1139="" className="nutrient-title">
                            {/* {t("home.text_banner1")} */}
                            {t("Thăm nông trại của bạn")}
                        </div>
                        <div data-v-caee1139="" className="nutrient-desc">
                            {/* {t("home.text_banner2")} */}
                            {t("Thường xuyên thăm nông trại để có thu nhập tốt hơn")}
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default NutientBanner