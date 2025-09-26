import { notification } from "antd"
import requestService from "api/request"
import { useTranslation } from "react-i18next"
import { useGlobalAppStore } from "store/useGlobalApp"

const UnlockLand = () => {
  const { handleToggleModal, handleCallbackUser, handleLoading, loading } = useGlobalAppStore()
  const { t } = useTranslation()
  const handleUnlockLand = async () => {
    if (loading) return

    handleLoading(true)
    try {
      const res = await requestService.post('/tickets/unlock-land')
      if (res && res.data) {
        handleCallbackUser()
        handleToggleModal({
          name: "",
          type: "",
          title: ""
        })
      }
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message,
        duration: 3,
        placement: 'top'
      })
    }
    handleLoading(false)
  }
  return (
    <div className='text-[12px] text-[#000]  z-50 relative h-[250px] flex flex-col justify-center'>
      <p className="text-center text-black text-[15px]">
        {t("Bạn có muốn")} <strong className="text-red-600">{t("mở khóa ô đất này với")} 8
          <span>
            <img src="/icons/diamond-icon.svg" className="inline-block" width={15} />
          </span>
        </strong> {t("không")}?<br />
        <span className="text-gray-700">
          {t("Khám phá vùng đất mới và bắt đầu xây dựng trang trại của bạn ngay hôm nay")}!</span>
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleUnlockLand}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-[15px] font-semibold shadow">
            {t("Mở khóa")}
          </button>
          <button
            onClick={() => handleToggleModal({
              name: "",
              type: "",
              title: ""
            })}
            className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg text-[15px] font-semibold">
            {t("Hủy")}
          </button>
        </div>
      </div>

    </div>
  )
}

export default UnlockLand