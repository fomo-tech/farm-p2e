
import hom_adve from 'assets/images/home_advertising_tips_icon.png'
import ButtonImage from 'components/elements/ButtonCustom'
import bg_btn from 'assets/img_custom/public_pup_btn_received.png'
import { useStoreFarm } from 'store/useStoreFarm'
import { useState } from 'react';
import { Drawer, notification } from 'antd';
import useBreakpoint from 'hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
import { useGlobalAppStore } from 'store/useGlobalApp';
import requestService from 'api/request';
import close_icon from 'assets/img_custom/clolor_dialog_close.png'
const TabBar = () => {
  const { dataInvest } = useStoreFarm()
  const breakpoint = useBreakpoint()
  const [openConfirm, setOpenConfirm] = useState<any>(false)
  const [showInfo, setShowInfo] = useState(false)
  const [investSelected, setInvestSelected] = useState<any>(null)
  const { loading, handleLoading, handleCallbackUser, handleToggleModal } = useGlobalAppStore()
  const { t } = useTranslation()

  const handleBuyTicket = async (ticketId: string) => {
    handleLoading(true)
    try {
      const res = await requestService.post('/tickets', {
        data: {
          ticketId
        }
      })
      if (res && res.data) {
        notification.success({
          message: res.data?.message,
          duration: 3,
          placement: "top"
        })
        handleCallbackUser()
        setOpenConfirm(false)
        setInvestSelected(null)

      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
        placement: "top"
      })
      setOpenConfirm(false)
    }
    handleLoading(false)
  }

  return (
    <div className="border-box  z-[999] bg-[#c28569]  fixed bottom-[10px] left-1/2 translate-x-[-50%] max-w-[400px]  w-full">
      <div className="border-box flex justify-between items-center relative">

        <div className="absolute right-[-15px] top-[-15px] cursor-pointer"
          onClick={() => handleToggleModal({
            name: "guide",
            title: "GUIDE",
            type: 'modal'
          })}
        >
          <img src={hom_adve} width={25} className='object-cover' />
        </div>
        {
          dataInvest?.map((i: any, idx: number) => (
            <div className="relative flex flex-col items-center justify-center" key={idx}>
              <img src={i?.urlImage} width={50} />
              <ButtonImage bgImg={bg_btn}
                title={
                  <div className="flex gap-2 items-center font-[500] text-[13px] text-[#000]">
                    {i?.price}
                    <img src={"https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"} width={13} /></div>
                }
                onEvent={() => {
                  setShowInfo(true)
                  setInvestSelected(i)
                }}
                width={65}
              />
            </div>
          ))
        }
      </div>

      <Drawer

        className='modal-confirm-buy bg_custom_drawer'
        placement={breakpoint === 'mobile' ? 'bottom' : "left"}
        height={"auto"}
        closable={false}
        onClose={() => setOpenConfirm(false)}
        zIndex={9999}
        title={
          <div className='flex justify-between'>
            <div className='text-center font-[900] text-[3.5rem] text-[#fff]'>
              {t("Xác nhận")}
            </div>
            <button className='text-yellow-700 underline text-[3rem] font-[500]'
              onClick={() => {
                setOpenConfirm(false)

              }}
            >
              <img src={close_icon} width={30} />
            </button>

          </div>
        }
        open={openConfirm}
      >
        <div className="bg-[#fff9ec]  border border-yellow-300 rounded-[20px] p-5 text-center shadow-md">
          <h3 className="text-[16px] font-semibold text-[#333] my-5">
            {t("Bạn xác nhận thuê trang trại này với giá")}

            <span className="text-[20px] ml-[10px]   font-bold text-red-600   gap-2">
              {investSelected?.price}
              <img src="/icons/diamond-icon.svg" width={20} alt="diamond" className='inline-block' />
              <span className='text-[#333]'> {t("trong")} </span>
              <span className="text-orange-600 font-bold ml-1">
                {" "}{investSelected?.earningDay}  {t("ngày")}
              </span>
              {" "}?

            </span>
          </h3>
          <div className="mt-4 px-5">
            <button
              className="w-full h-[40px]  bg-[#8B4513] text-white py-2 rounded-xl text-[16px] font-bold hover:opacity-90 transition"
              onClick={() => handleBuyTicket(investSelected)}
              disabled={loading}
            >
              {t("Xác nhận")}
            </button>
          </div>
        </div>

      </Drawer>

      <Drawer

        className='modal-confirm-buy bg_custom_drawer'
        placement={breakpoint === 'mobile' ? 'bottom' : "left"}
        height={"auto"}
        closable={false}
        onClose={() => setShowInfo(false)}
        zIndex={99999}
        title={
          <div className='flex justify-between'>
            <div className='text-center font-[900] text-[#fff] text-[3.5rem] flex items-center gap-2'>
              {t("Thông tin trang trại")}
            </div>
            <button className='text-yellow-700 underline text-[3rem] font-[500]'
              onClick={() => setShowInfo(false)}
            >
              <img src={close_icon} width={30} />

            </button>

          </div>
        }
        open={showInfo}
      >
        <div className="bg-[#fffef0] rounded-[20px] p-5 shadow-lg border border-yellow-200  mx-auto">
          <div className="space-y-4 text-[16px] text-[#444]">
            <div className="flex justify-center items-center mb-[15px]">
              <img src={investSelected?.desImage} width={100} className='animal' />
            </div>
            <div className="flex justify-between items-center !mb-[15px]">
              <span>{t("Tên trang trại")}</span>
              <span className="font-bold text-right">{investSelected?.name}</span>
            </div>

            <div className="flex justify-between items-center !mb-[15px]">
              <span>{t("Thời gian thuê")}</span>
              <span className="font-bold text-right">
                {investSelected?.earningDay} {t("home.day")}
              </span>
            </div>

            <div className="flex justify-between items-center !mb-[10px]">
              <span>{t("Thu nhập mỗi ngày")}</span>
              <span className="font-bold text-green-600 flex items-center gap-1">
                +{investSelected?.incomePerDay} <img src="/icons/diamond-icon.svg" width={18} />
              </span>
            </div>

            <div className="flex justify-between items-center !mb-[15px]">
              <span>{t("Giá thuê")}</span>
              <span className="font-bold text-red-500 flex items-center gap-1">
                {investSelected?.price} <img src="/icons/diamond-icon.svg" width={18} />
              </span>
            </div>

            <div className="flex justify-between items-center mb-[15px]">
              <span>{t("Tổng thu nhập")}</span>
              <span className="font-bold text-blue-500 flex items-center gap-1">
                ≈ {Number((investSelected?.incomePerDay * investSelected?.earningDay).toFixed(3))} <img src="/icons/diamond-icon.svg" width={18} />
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              className="w-full h-[50px] bg-[#8B4513] text-white  font-bold py-2 rounded-xl hover:opacity-90 transition"
              onClick={() => {
                setShowInfo(false);
                setOpenConfirm(true);
              }}
            >
              {t("Thuê ngay")}
            </button>
          </div>
        </div>

      </Drawer>
    </div>
  );
};

export default TabBar;
