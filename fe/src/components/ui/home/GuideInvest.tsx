import React from 'react'
import { useTranslation } from 'react-i18next'

const GuideInvest = () => {
  const { i18n } = useTranslation()
  const lang = i18n?.language

  if (lang === 'vi') {
    return (
      <div className='h-[250px] z-[10] relative overflow-y-scroll px-3 py-2 leading-relaxed text-[#333]'>
        <strong className='text-[#2e7d32]'>📘 Hướng dẫn chăn nuôi trong trang trại</strong><br /><br />

        <strong className='text-[#1565c0]'>1️⃣ Chọn thú để nuôi</strong><br />
        Mỗi loài vật có giá và điều kiện chuồng khác nhau.<br />
        Hãy chọn phù hợp với số kim cương bạn đang có.<br /><br />

        <strong className='text-[#1565c0]'>2️⃣ Thu hoạch lợi nhuận mỗi ngày 💰</strong><br />
        ⏳ Mỗi thú làm việc trong <strong>24 giờ</strong> để tạo ra lợi nhuận.<br />
        ✅ Sau 24 giờ, bạn có thể thu hoạch.<br />
        ⚠️ Nếu thu hoạch trễ, thú sẽ mệt và giảm năng suất.<br />
        ❌ Nếu quá <strong>1 giờ</strong> sau khi hết thời gian mà chưa thu hoạch, thú sẽ biến mất khỏi chuồng!<br />
        🧭 Bạn sẽ không nhận được lợi nhuận nếu bỏ quên thú quá lâu.<br /><br />

        <em>🔍 Chạm vào từng con thú để xem hướng dẫn chi tiết hơn.</em>
      </div>
    )
  }

  if (lang === 'en') {
    return (
      <div className='h-[250px] z-[10] relative overflow-y-scroll px-3 py-2 leading-relaxed text-[#333]'>
        <strong className='text-[#2e7d32]'>📘 Guide to Farming in Your Farm</strong><br /><br />

        <strong className='text-[#1565c0]'>1️⃣ Choose Animals to Raise</strong><br />
        Each animal has different prices and cage requirements.<br />
        Please choose according to the diamonds you have.<br /><br />

        <strong className='text-[#1565c0]'>2️⃣ Harvest Daily Profits 💰</strong><br />
        ⏳ Each animal works for <strong>24 hours</strong> to generate profits.<br />
        ✅ You can harvest after 24 hours.<br />
        ⚠️ Late harvest will make the animal tired and reduce productivity.<br />
        ❌ If you delay more than <strong>1 hour</strong> after the time is up, the animal will disappear from the cage!<br />
        🧭 You won’t get profits if you neglect your animals too long.<br /><br />

        <em>🔍 Tap on each animal for detailed instructions.</em>
      </div>
    )
  }

  // Default / Chinese content
  return (
    <div className='h-[250px] z-[10] relative overflow-y-scroll px-3 py-2 leading-relaxed text-[#333]'>
      <strong className='text-[#2e7d32]'>📘 养殖指南</strong><br /><br />

      <strong className='text-[#1565c0]'>1️⃣ 选择宠物</strong><br />
      每种动物有不同的价格和笼舍要求。<br />
      请根据您拥有的钻石数量进行选择。<br /><br />

      <strong className='text-[#1565c0]'>2️⃣ 每日收获利润 💰</strong><br />
      ⏳ 每只动物工作 <strong>24小时</strong> 以产生利润。<br />
      ✅ 24小时后，您可以收获。<br />
      ⚠️ 收获延迟会使动物疲劳并降低生产力。<br />
      ❌ 超过结束时间 <strong>1小时</strong> 未收获，动物将消失！<br />
      🧭 忽视宠物过久将无法获得利润。<br /><br />

      <em>🔍 点击每只动物查看详细说明。</em>
    </div>
  )
}

export default GuideInvest
