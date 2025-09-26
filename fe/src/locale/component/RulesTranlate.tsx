import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalAppStore } from 'store/useGlobalApp'

export const RulesTranlate = () => {
  const { configApp } = useGlobalAppStore()
  const { i18n } = useTranslation()

  if (i18n.language === 'en')
    return (
      <div data-v-f443897c="" className="vip-rules">
        <div data-v-f443897c="" className="rules-section">
          <h3 data-v-f443897c="" className="section-title">
            Upgrade Rules
          </h3>
          <div data-v-f443897c="" className="rule-content">
            <div data-v-f443897c="" className="rule-item">
              <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"></i>
              <div data-v-f443897c="" className="rule-text">
                <h4 data-v-f443897c="">Valid Invitation Description</h4>
                <p data-v-f443897c="">
                  The invited user must purchase a pet for the invitation to be considered valid.
                </p>
              </div>
            </div>

            <div data-v-f443897c="" className="rule-item">
              <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-gift-o rule-icon"></i>
              <div data-v-f443897c="" className="rule-text">
                <h4 data-v-f443897c="">Upgrade Rewards</h4>
                <p data-v-f443897c="">
                  Each time you upgrade a level, you can receive corresponding rewards.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div data-v-f443897c="" className="rules-section">
          <h3 data-v-f443897c="" className="section-title">
            Benefits and Details for Subordinates
          </h3>
          <div data-v-f443897c="" className="rule-content">
            <div data-v-f443897c="" className="bonus-desc">
              <p data-v-f443897c="">
                Subordinates will receive 1% commission from every farm rental and harvest transaction made by their superiors.
              </p>

              <h4 data-v-f443897c="">Detailed Description</h4>
              <div data-v-f443897c="" className="example-item">
                <div data-v-f443897c="" className="example-title">
                  Level A (Direct Invite)
                </div>
                <p data-v-f443897c="">
                  Example:<br />
                  - If a Level A user rents a farm worth 1,000 USD, all their subordinates will receive a total of 10 USD.<br />
                  - If a Level A user harvests a reward worth 2 USD/day, all their subordinates will receive a total of 0.02 USD.<br />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div data-v-f443897c="" className="rules-section">
          <h3 data-v-f443897c="" className="section-title">
            Commission Description
          </h3>
          <div data-v-f443897c="" className="rule-content">
            <div data-v-f443897c="" className="bonus-desc">
              <p data-v-f443897c="">
                Different referral levels receive different commission rates.
              </p>
              <p data-v-f443897c="">
                Specific rates:{" "}
                <span data-v-f443897c="" className="van-tag van-tag--primary">
                  Level A: {configApp?.vipReward?.reward_a}%
                </span>{" "}
                <span data-v-f443897c="" className="van-tag van-tag--success">
                  Level B: {configApp?.vipReward?.reward_b}%
                </span>{" "}
                <span data-v-f443897c="" className="van-tag van-tag--warning">
                  Level C: {configApp?.vipReward?.reward_c}%
                </span>
              </p>

              <h4 data-v-f443897c="">Detailed Description</h4>

              <div data-v-f443897c="" className="example-item">
                <div data-v-f443897c="" className="example-title">
                  Level A (Direct Invite)
                </div>
                <p data-v-f443897c="">
                  If a Level A user rents a farm worth 1,000 USD, you will receive
                  {configApp?.vipReward?.reward_a}% commission ({1000 * configApp?.vipReward?.reward_a / 100} USD) from their purchase.
                </p>
                <p data-v-f443897c="">
                  If a Level A user harvests a farm worth 10 USD/day, you will receive
                  {configApp?.vipReward?.reward_a}% commission ({10 * configApp?.vipReward?.reward_a / 100} USD) from their harvest.
                </p>
              </div>

              <div data-v-f443897c="" className="example-item">
                <div data-v-f443897c="" className="example-title">
                  Level B (Invited by Level A)
                </div>
                <p data-v-f443897c="">
                  If a Level B user rents a farm worth 1,000 USD, you will receive
                  {configApp?.vipReward?.reward_b}% commission ({1000 * configApp?.vipReward?.reward_b / 100} USD) from their purchase.
                </p>
                <p data-v-f443897c="">
                  If a Level B user harvests a farm worth 10 USD/day, you will receive
                  {configApp?.vipReward?.reward_b}% commission ({10 * configApp?.vipReward?.reward_b / 100} USD) from their harvest.
                </p>
              </div>

              <div data-v-f443897c="" className="example-item">
                <div data-v-f443897c="" className="example-title">
                  Level C (Invited by Level B)
                </div>
                <p data-v-f443897c="">
                  If a Level C user rents a farm worth 1,000 USD, you will receive
                  {configApp?.vipReward?.reward_c}% commission ({1000 * configApp?.vipReward?.reward_c / 100} USD) from their purchase.
                </p>
                <p data-v-f443897c="">
                  If a Level C user harvests a farm worth 10 USD/day, you will receive
                  {configApp?.vipReward?.reward_c}% commission ({10 * configApp?.vipReward?.reward_c / 100} USD) from their harvest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    )

  if (i18n.language === 'zh')
    return <div data-v-f443897c="" className="vip-rules">
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          升级规则
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">有效邀请说明</h4>
              <p data-v-f443897c="">
                被邀请人必须购买宠物，该邀请才被视为有效。
              </p>
            </div>
          </div>

          <div data-v-f443897c="" className="rule-item">
            <i data-v-f443897c="" className="van-badge__wrapper van-icon van-icon-gift-o rule-icon"></i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">升级奖励</h4>
              <p data-v-f443897c="">
                每次升级都可以获得相应的奖励。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          下级用户的权益及详细说明
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="bonus-desc">
            <p data-v-f443897c="">
              下级每次租用农场或收获奖励时将获得上级交易金额的1%作为佣金。
            </p>

            <h4 data-v-f443897c="">详细说明</h4>
            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                A级（直接邀请）
              </div>
              <p data-v-f443897c="">
                例如：<br />
                - 如果A级用户租用价值1,000美元的农场，下级将获得共计10美元佣金。<br />
                - 如果A级用户每天收获2美元的奖励，下级将获得共计0.02美元佣金。<br />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          佣金说明
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="bonus-desc">
            <p data-v-f443897c="">
              不同等级的邀请人将获得不同的佣金比例。
            </p>
            <p data-v-f443897c="">
              具体如下：{" "}
              <span data-v-f443897c="" className="van-tag van-tag--primary">
                A级: {configApp?.vipReward?.reward_a}%
              </span>{" "}
              <span data-v-f443897c="" className="van-tag van-tag--success">
                B级: {configApp?.vipReward?.reward_b}%
              </span>{" "}
              <span data-v-f443897c="" className="van-tag van-tag--warning">
                C级: {configApp?.vipReward?.reward_c}%
              </span>
            </p>

            <h4 data-v-f443897c="">详细说明</h4>

            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                A级（直接邀请）
              </div>
              <p data-v-f443897c="">
                如果A级用户租用价值1,000美元的农场，您将获得
                {configApp?.vipReward?.reward_a}%佣金（{1000 * configApp?.vipReward?.reward_a / 100} 美元）。
              </p>
              <p data-v-f443897c="">
                如果A级用户每天收获10美元，您将获得
                {configApp?.vipReward?.reward_a}%佣金（{10 * configApp?.vipReward?.reward_a / 100} 美元）。
              </p>
            </div>

            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                B级（邀请A级）
              </div>
              <p data-v-f443897c="">
                如果B级用户租用价值1,000美元的农场，您将获得
                {configApp?.vipReward?.reward_b}%佣金（{1000 * configApp?.vipReward?.reward_b / 100} 美元）。
              </p>
              <p data-v-f443897c="">
                如果B级用户每天收获10美元，您将获得
                {configApp?.vipReward?.reward_b}%佣金（{10 * configApp?.vipReward?.reward_b / 100} 美元）。
              </p>
            </div>

            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                C级（邀请B级）
              </div>
              <p data-v-f443897c="">
                如果C级用户租用价值1,000美元的农场，您将获得
                {configApp?.vipReward?.reward_c}%佣金（{1000 * configApp?.vipReward?.reward_c / 100} 美元）。
              </p>
              <p data-v-f443897c="">
                如果C级用户每天收获10美元，您将获得
                {configApp?.vipReward?.reward_c}%佣金（{10 * configApp?.vipReward?.reward_c / 100} 美元）。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


  return (
    <div data-v-f443897c="" className="vip-rules ">
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          Quy tắc nâng cấp
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="rule-item">
            <i
              data-v-f443897c=""
              className="van-badge__wrapper van-icon van-icon-friends-o rule-icon"
            >
              {/**/}
              {/**/}
              {/**/}
            </i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Mô tả lời mời hợp lệ</h4>
              <p data-v-f443897c="">
                Người được mời phải mua vật nuôi thì lời mời được coi là hợp lệ.
              </p>
            </div>
          </div>

          <div data-v-f443897c="" className="rule-item">
            <i
              data-v-f443897c=""
              className="van-badge__wrapper van-icon van-icon-gift-o rule-icon"
            >
              {/**/}
              {/**/}
              {/**/}
            </i>
            <div data-v-f443897c="" className="rule-text">
              <h4 data-v-f443897c="">Phần thưởng nâng cấp</h4>
              <p data-v-f443897c="">
                Mỗi lần nâng cấp cấp độ có thể nhận phần thưởng tương ứng.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          Lợi ích và mô tả chi tiết cho người cấp dưới
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="bonus-desc">
            <p data-v-f443897c="">
              Cấp dưới sẽ nhận được 1% hoa hồng từ mỗi giao dịch thuê trang trại và thu hoạch trang trại của cấp trên.
            </p>

            <h4 data-v-f443897c="">Mô tả chi tiết</h4>
            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                Cấp A (mời trực tiếp)
              </div>
              <p data-v-f443897c="">
                Ví dụ: <br />
                - Nếu người dùng cấp A thuê một trang trại có giá trị 1.000 USD, thì tất cả các cấp dưới của họ sẽ nhận được tổng cộng 10 USD. <br />
                - Nếu người dùng cấp A thu hoạch phần thưởng trang trại có giá trị 2 USD / ngày, thì tất cả các cấp dưới của họ sẽ nhận được tổng cộng 0.02 USD. <br />
              </p>
            </div>

          </div>
        </div>
      </div>
      <div data-v-f443897c="" className="rules-section">
        <h3 data-v-f443897c="" className="section-title">
          Mô tả hoa hồng
        </h3>
        <div data-v-f443897c="" className="rule-content">
          <div data-v-f443897c="" className="bonus-desc">
            <p data-v-f443897c="">
              Các cấp độ khác nhau của người giới thiệu có tỷ lệ hoa hồng khác nhau.
            </p>
            <p data-v-f443897c="">
              Mô tả cụ thể{" "}
              <span data-v-f443897c="" className="van-tag van-tag--primary">
                Cấp A: {configApp?.vipReward?.reward_a}%
              </span>{" "}
              <span data-v-f443897c="" className="van-tag van-tag--success">
                Cấp B: {configApp?.vipReward?.reward_b}%
              </span>{" "}
              <span data-v-f443897c="" className="van-tag van-tag--warning">
                Cấp C: {configApp?.vipReward?.reward_c}%
              </span>
            </p>
            <h4 data-v-f443897c="">Mô tả chi tiết</h4>
            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                Cấp A (mời trực tiếp)
              </div>
              <p data-v-f443897c="">
                Nếu người dùng cấp A thuê trang trại trị giá 1.000 đô la, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_a}% ({1000 * configApp?.vipReward?.reward_a / 100} USD) từ số tiền mua của họ.
              </p>
              <p data-v-f443897c="">
                Nếu người dùng cấp A thu hoạch trang trại trị giá 10 USD/ ngày, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_a}% ({10 * configApp?.vipReward?.reward_a / 100} USD) từ số tiền thu hoach của họ.
              </p>
            </div>
            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                Cấp B (mời trực tiếp cấp A)
              </div>
              <p data-v-f443897c="">
                Nếu người dùng cấp B thuê trang trại trị giá 1.000 USD, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_b}% ({1000 * configApp?.vipReward?.reward_b / 100} USD) từ số tiền mua của họ.
              </p>
              <p data-v-f443897c="">
                Nếu người dùng cấp B thu hoạch trang trại trị giá 10 USD/ ngày, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_b}% ({10 * configApp?.vipReward?.reward_b / 100} USD) từ số tiền thu hoach của họ.
              </p>
            </div>
            <div data-v-f443897c="" className="example-item">
              <div data-v-f443897c="" className="example-title">
                Cấp C (mời trực tiếp cấp B)
              </div>
              <p data-v-f443897c="">
                Nếu người dùng cấp C thuê trang trại trị giá 1.000 USD, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_c}% ({1000 * configApp?.vipReward?.reward_c / 100} USD) từ số tiền mua của họ.
              </p>
              <p data-v-f443897c="">
                Nếu người dùng cấp C thu hoạch trang trại trị giá 10 USD/ ngày, bạn sẽ nhận được
                hoa hồng {configApp?.vipReward?.reward_c}% ({10 * configApp?.vipReward?.reward_c / 100} USD) từ số tiền thu hoach của họ.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
