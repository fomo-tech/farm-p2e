import requestService from 'api/request'
import Empty from 'components/elements/Empty'
// import RecordOrders from 'components/ui/RecordOrders'
// import { formatTime } from 'lib/helpers'

import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useTranslation } from 'react-i18next'
// import bg_order from 'assets/images/d2a7ec6d39f2a709844f1b935c241855cd3ce0.jpg'

import { useNavigate } from 'react-router-dom'
import { useGlobalAppStore } from 'store/useGlobalApp'
import OrderItem from 'components/ui/OrderItem'
const Order = () => {
    const [orders, setOrders] = useState([])
    const { handleLoading, loading } = useGlobalAppStore()
    const navigate = useNavigate()
    const [isCallBack, setIsCallBack] = useState(false)
    // const [openRecord, setOpenRecord] = useState(false)
    const { t, i18n } = useTranslation()

    const getOrders = async () => {
        handleLoading(true)
        try {
            const res = await requestService.get('/tickets/orders')
            if (res && res.data) {
                setOrders(res.data?.data)
            }
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
        }
        handleLoading(false)
    }

    useEffect(() => {
        getOrders();
    }, [isCallBack]);
    return (
        <div data-v-cde322bf="" data-v-e697ea1f="" className="nft-list-page relative">

            <div data-v-cde322bf="" className="page-content !pt-0">
                <div data-v-cde322bf="" className="nft-grid" >
                    {
                        orders?.length > 0 &&
                        orders.map((i: any, index) => (
                            <OrderItem key={index} i={i} setIsCallBack={() => setIsCallBack(!isCallBack)} />
                        ))

                    }
                </div>
                {
                    !loading && orders?.length === 0 && <Empty title={t('No Farm')} />
                }
            </div>


        </div>

    )
}

export default Order