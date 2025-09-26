import { Modal } from "antd";
import i18n from "i18next";

const MineGuide = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const lang = i18n.language;

  if (lang === "vi") {
    return (
      <Modal footer={null} width={300} open={open} onCancel={onClose} centered title="Hướng dẫn trò chơi">
        <p>
          Mỗi ngày, bạn là <b>VIP1</b> sẽ được tặng <b>1 lượt mở miễn phí</b>.
        </p>
        <p>
          Mỗi lượt mở mang đến những phần quà hấp dẫn, đừng bỏ lỡ nhé!
        </p>
        <p>
          Nếu không có lượt miễn phí, bạn có thể mở với giá chỉ <b>0.2 $</b>.
        </p>
        <p style={{ fontStyle: 'italic', color: '#888' }}>
          Chúc bạn may mắn và vui vẻ khi chơi!
        </p>
      </Modal>
    );
  } else if (lang === "en") {
    return (
      <Modal footer={null} width={300} open={open} onCancel={onClose} centered title="Game Guide">
        <p>Each day, you will get <b>1 free spin</b>.</p>
        <p>Each spin may bring you attractive rewards.</p>
        <p>If you run out of free spins, you can spin for only <b>$0.2</b>.</p>
        <p style={{ fontStyle: 'italic', color: '#888' }}>Good luck and have fun!</p>
      </Modal>
    );
  } else if (lang === "zh") {
    return (
      <Modal footer={null} width={300} open={open} onCancel={onClose} centered title="游戏指南">
        <p>每天你将获得 <b>1次免费抽奖机会</b>。</p>
        <p>每次抽奖都有可能获得丰厚奖励。</p>
        <p>如果没有免费抽奖次数，你可以花费 <b>0.2美元</b> 进行抽奖。</p>
        <p style={{ fontStyle: 'italic', color: '#888' }}>祝你好运，玩得开心！</p>
      </Modal>
    );
  } else {
    // default fallback nếu chưa có ngôn ngữ phù hợp
    return (
      <Modal footer={null} width={300} open={open} onCancel={onClose} centered title="Game Guide">
        <p>Each day, you will get <b>1 free spin</b>.</p>
        <p>Each spin may bring you attractive rewards.</p>
        <p>If you run out of free spins, you can spin for only <b>$0.2</b>.</p>
        <p style={{ fontStyle: 'italic', color: '#888' }}>Good luck and have fun!</p>
      </Modal>
    );
  }
};

export default MineGuide;
