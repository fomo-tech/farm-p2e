import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsAndPrivacy = () => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const content = {
    vi: {
      title: "Điều khoản & Chính sách",
      termsTitle: "📜 Điều khoản Dịch vụ",
      termsContent:
        "Khi tham gia sử dụng nền tảng Farming Game, bạn đồng ý tuân thủ các quy định về tài khoản, hoạt động trong game và quy trình nhận thưởng. Người dùng cam kết không sử dụng gian lận, không gây ảnh hưởng đến trải nghiệm của người chơi khác và chịu trách nhiệm với mọi hành vi trên tài khoản cá nhân.",
      privacyTitle: "🔐 Chính sách Bảo mật",
      privacyContent:
        "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu như email, số điện thoại và lịch sử giao dịch được lưu trữ bảo mật và chỉ sử dụng nhằm mục đích hỗ trợ dịch vụ, cải thiện trải nghiệm người dùng, hoặc theo yêu cầu của pháp luật. Nền tảng tuyệt đối không chia sẻ thông tin với bên thứ ba khi không có sự đồng ý của người dùng.",
      back: "Quay lại",
    },
    en: {
      title: "Terms & Privacy Policy",
      termsTitle: "📜 Terms of Service",
      termsContent:
        "By using the Farming Game platform, you agree to comply with the rules regarding your account, in-game activities, and the reward process. Users commit not to cheat, not to affect others’ experience, and to be responsible for all actions on their personal account.",
      privacyTitle: "🔐 Privacy Policy",
      privacyContent:
        "We are committed to protecting your personal information. Data such as email, phone number, and transaction history are securely stored and used solely for service support, user experience improvement, or as required by law. We do not share your data with third parties without your consent.",
      back: "Back",
    },
    zh: {
      title: "条款与隐私政策",
      termsTitle: "📜 服务条款",
      termsContent:
        "使用 Farming Game 平台即表示您同意遵守有关账户、游戏活动和奖励流程的规定。用户承诺不作弊、不影响其他玩家体验，并对其账户的所有行为负责。",
      privacyTitle: "🔐 隐私政策",
      privacyContent:
        "我们承诺保护您的个人信息。邮箱、电话号码和交易记录等数据将被安全存储，仅用于服务支持、提升用户体验或根据法律要求使用。未经用户同意，我们绝不与第三方共享您的信息。",
      back: "返回",
    },
  };

  const langContent = content[lang as 'vi' | 'en' | 'zh'] || content.vi;

  return (
    <div className="px-5 mx-auto py-8 text-gray-800">
      <h1 className="text-[25px] font-bold mb-6 text-center">{langContent.title}</h1>

      <section className="mb-8">
        <h2 className="text-[20px] font-semibold mb-2 text-blue-700">{langContent.termsTitle}</h2>
        <p className="leading-relaxed">{langContent.termsContent}</p>
      </section>

      <section>
        <h2 className="text-[20px] font-semibold mb-2 text-green-700">{langContent.privacyTitle}</h2>
        <p className="leading-relaxed">{langContent.privacyContent}</p>
      </section>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          {langContent.back}
        </button>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
