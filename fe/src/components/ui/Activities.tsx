import ButtonImage from 'components/elements/ButtonCustom';
import bg_btn from 'assets/img_custom/home_withdraw_btn_bg_img.png';
import ListModal, { ListItem } from 'components/elements/ListModal';
import { useTranslation } from 'react-i18next';
import { useGlobalAppStore } from 'store/useGlobalApp';

// Image assets
import j120 from 'assets/images/boom_v2 copy.png';
import activity1 from 'assets/images/home_nav_icon_sign.png';

const activityList = [
  {
    icon: j120,
    titleKey: 'Hộp may mắn',
    modalName: 'lucky_box',
    modalTitle: 'Lucky Box',
  },
  {
    icon: 'https://img.icons8.com/?size=100&id=lCQ1YNBkdOcR&format=png&color=000000',
    titleKey: 'Vòng xoay may mắn',
    modalName: 'lucky_draw',
    modalTitle: 'Lucky Draw',
  },
  {
    icon: activity1,
    titleKey: 'Điểm danh hàng ngày',
    modalName: 'checkin',
    modalTitle: 'Checkin',
  },
];

const Activities = () => {
  const { t } = useTranslation();
  const { handleToggleModal } = useGlobalAppStore();

  return (
    <div className="relative rounded-md p-2.5">
      <ListModal>
        {activityList.map((activity, index) => (
          <ListItem key={index}>
            <div
              className="w-[50px] h-[50px] mr-2.5 bg-center bg-no-repeat bg-cover flex justify-center items-center"
              style={{ backgroundImage: 'url("")' }}
            >
              <img src={activity.icon} alt="activityIcon" className="object-cover" />
            </div>
            <div className="flex-1 text-white text-[12px] text-left font-bold max-w-[150px]">
              {t(activity.titleKey)}
            </div>
            <ButtonImage
              title={t("Tham gia")}
              bgImg={bg_btn}
              width={80}
              height={30}
              onEvent={() =>
                handleToggleModal({
                  name: activity.modalName,
                  type: 'modal',
                  title: activity.modalTitle,
                })
              }
            />
          </ListItem>
        ))}
      </ListModal>
    </div>
  );
};

export default Activities;
