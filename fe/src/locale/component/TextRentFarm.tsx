import React from 'react'
import { useTranslation } from 'react-i18next'

const TextRentFarm = ({ item }: { item: any }) => {
    const { i18n } = useTranslation()
    if (i18n?.language === 'en')
        return (
            <p>
                🚜 You are about to rent the farm <span className='font-[700] text-orange-700'>{item?.name}</span>!<br /><br />

                💵 <b>Rental price:</b> {item?.price} USD for {item?.earningDay} days.<br />
                📈 <b>Income:</b> You will earn {item?.incomePerDay} USD per day from this farm.<br /><br />

                ⏰ <b>Important notes:</b><br />
                - Be sure to log in at the same time each day, starting from the rental time, to <b>harvest</b>.<br />
                - If you <b>miss</b> a harvest, <span className="text-red-500">your earnings will be reduced</span>.<br /><br />

                🕐 When the rental period ends (after {item?.earningDay} days), you will have <b>1 hour</b> to <b>collect any remaining rewards</b>.<br />
                After this time, you <span className="text-red-500">will no longer be able to harvest</span>.<br /><br />

                ❌ If you want to stop early, you can <b>cancel the rental contract at any time</b>.<br />
                Upon cancellation, the system will refund <b>10% of the rental fee, equivalent to {item?.price * 0.1} USD</b>.<br /><br />

                🌱 Stay consistent with your harvests so you don't miss out on the farm's rewards!
            </p>

        )
    if (i18n?.language === 'zh')
        return (
            <p>
                🚜 您即将租用农场 <span className='font-[700] text-orange-700'>{item?.name}</span>！<br /><br />

                💵 <b>租金：</b>{item?.price} 美元，有效期为 {item?.earningDay} 天。<br />
                📈 <b>收益：</b>每天可获得 {item?.incomePerDay} 美元的收益。<br /><br />

                ⏰ <b>重要提示：</b><br />
                - 请每天在租用时间开始后的相同时间 <b>收获</b>。<br />
                - 如果您<b>错过</b>当天的收获，<span className="text-red-500">您的收益将会减少</span>。<br /><br />

                🕐 当租期结束（{item?.earningDay} 天后），您将有 <b>1 小时</b> 的时间来 <b>领取所有剩余奖励</b>。<br />
                超过时间后，您将 <span className="text-red-500">无法再进行收获</span>。<br /><br />

                ❌ 如果您想提前结束租赁，可以<b>随时取消租赁合约</b>。<br />
                取消后，系统将退还 <b>10% 的租金（约 {item?.price * 0.1} 美元）</b> 给您。<br /><br />

                🌱 请勤劳收获，别错过农场的奖励哦！
            </p>

        )
    return (
        <p>
            🚜 Bạn đang chuẩn bị thuê trang trại <span className='font-[700] text-orange-700'>{item?.name}</span>!<br /><br />

            💵 <b>Giá thuê:</b> {item?.price} USD trong vòng {item?.earningDay} ngày.<br />
            📈 <b>Thu nhập:</b> Mỗi ngày bạn sẽ nhận được {item?.incomePerDay} USD từ trang trại này.<br /><br />

            ⏰ <b>Lưu ý quan trọng:</b><br />
            - Hãy vào đúng thời điểm mỗi ngày bắt đầu tư lúc thuê để <b>thu hoạch</b>.<br />
            - Nếu bạn <b>bỏ lỡ</b> không thu hoạch trong ngày, <span className="text-red-500">bạn sẽ giảm đi thu nhập của bạn</span>.<br /><br />

            🕐 Khi hết thời gian thuê (sau {item?.earningDay} ngày), bạn sẽ có <b>1 giờ</b> để <b>thu thập toàn bộ phần thưởng còn lại</b>.<br />
            Nếu quá thời gian này, bạn <span className="text-red-500">sẽ không thể thu hoạch nữa</span>.<br /><br />

            ❌ Nếu muốn dừng giữa chừng, bạn có thể <b>huỷ hợp đồng thuê bất cứ lúc nào</b>.<br />
            Khi huỷ, hệ thống sẽ hoàn lại <b>10% số tiền thuê tương đương {item?.price * 0.1} USD </b> cho bạn.<br /><br />

            🌱 Hãy chăm chỉ thu hoạch để không bỏ lỡ phần thưởng từ trang trại nhé!
        </p>
    )
}

export default TextRentFarm