import { Modal } from 'antd';
import { ReactNode } from 'react';
import bg from 'assets/img_custom/fammily_bg_receive_callback.webp';
import close from 'assets/img_custom/public_icon_close_small.png';

interface Type_Props {
  isModalOpen: boolean;
  onOpen?: () => void;
  onCancel: () => void;
  children?: ReactNode;
  titleHeader: string | ReactNode;
}

const ModalBase = ({
  isModalOpen,
  onCancel,
  children,
  titleHeader,
}: Type_Props) => {
  return (
    <Modal
      centered
      open={isModalOpen}
      onCancel={onCancel}
      zIndex={99999}
      footer={null}
      width={400}
      closeIcon={
        <span
          className="absolute top-0 right-0 w-[30px] h-[30px] rounded-full bg-cover"
          style={{ backgroundImage: `url(${close})` }}
        ></span>
      }
      className="!p-4 !rounded-xl !bg-transparent !shadow-none relative modal-base-custom"
    >
      <div className="absolute  flex top-[7px] left-1/2 translate-x-[-50%] text-[#fff] z-[99] font-[900] text-[16px]">
        {titleHeader}
      </div>
      <div className="absolute inset-0 flex">
        <img src={bg} alt="" className="w-full h-full" />
      </div>

      <div className='px-[15px] pt-[50px] pb-[20px] z-[]'>
        {children}
      </div>
    </Modal>
  );
};

export default ModalBase;
