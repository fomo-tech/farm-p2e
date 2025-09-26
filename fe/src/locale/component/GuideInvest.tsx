import React from 'react'
import { useTranslation } from 'react-i18next'

const GuideInvest = () => {
  const { i18n } = useTranslation()

  if (i18n?.language === 'en') return (
    <div data-v-f443897c="" className="vip-rules !pb-[20rem]">
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          Farm Investment Guide
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Rent a Farm</h4>
              <p data-v-f443897c="">
                Each farm has a different rental cost. Make sure your account has enough balance to start renting and growing your farm.
              </p>
            </div>
          </div>

          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-gold-coin-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Harvest Profits</h4>
              <p data-v-f443897c="">
                You can harvest profits every 24 hours from the time of rental. If you miss the harvest time, the profits will gradually decrease. When the rental expires, you have 1 hour to collect earnings before the farm is reclaimed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (i18n?.language === 'zh') return (
    <div data-v-f443897c="" className="vip-rules !pb-[20rem]">
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          农场投资指南
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">租赁农场</h4>
              <p data-v-f443897c="">
                每个农场的租金不同。请确保您的账户余额充足，以便开始租赁并发展您的农场。
              </p>
            </div>
          </div>

          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-gold-coin-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">收获收益</h4>
              <p data-v-f443897c="">
                从租赁开始后每24小时可收获一次收益。如未及时收获，收益将逐渐减少。租赁到期后，您有1小时可收割，之后农场将被系统回收。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div data-v-f443897c="" className="vip-rules !pb-[20rem]">
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          Hướng dẫn đầu tư vật nuôi
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Đầu tư vật nuôi</h4>
              <p data-v-f443897c="">
                Mỗi loại vật nuôi có mức giá thuê khác nhau. Vui lòng đảm bảo tài khoản của bạn có đủ số dư để bắt đầu thuê và phát triển nông trại.
              </p>
              <p data-v-f443897c="">
                Mỗi vật nuôi cần một chuồng riêng để được mua. Giá mỗi chuồng là 8 $. Khi nạp tiền lần đầu, bạn sẽ nhận được một chuồng miễn phí.
              </p>
            </div>
          </div>

          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-gold-coin-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Thu hoạch lợi nhuận</h4>
              <p data-v-f443897c="">
                Bạn có thể thu hoạch lợi nhuận sau mỗi 24 giờ kể từ thời điểm mua vật nuôi. Nếu không thu hoạch đúng hạn, lợi nhuận sẽ giảm dần. Sau khi vật nuôi hết vòng đời, bạn có 1 giờ để thu hoạch trước khi nó biến mất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideInvest
