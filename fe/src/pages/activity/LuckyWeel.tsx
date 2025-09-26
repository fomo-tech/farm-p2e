import rw1 from 'assets/icons/fortune-wheel.png'
// import rw2 from 'assets/images/good-luck.png'

import { useTranslation } from "react-i18next"
import requestService from "api/request"
import { useState } from "react"
import { useAuthApp } from "store/useAuthApp"
import { useGlobalAppStore } from "store/useGlobalApp"
import actice_bg from 'assets/images/active.png'
import LuckyWheelGuide from "./components/LuckyWheelGuide"
import { Modal, notification } from 'antd'

const dolar = '/icons/diamond-icon.svg'
const dolar1 = '/icons/diamond-3.svg'
const dolar2 = '/icons/diamond-5.svg'
const dolar3 = '/icons/diamond-7.svg'


const rewardItems = [
  { id: 1, img: dolar, label: "$ 0.1", reward: "0.1" },
  { id: 2, img: dolar2, label: "$ 0.3", reward: "0.3" },
  { id: 3, img: rw1, reward: "Robot_Part", label: "+2 Turn" },
  { id: 4, img: dolar1, label: "$ 0.15", reward: "0.15" },
  { id: 5, img: dolar1, label: "$ 0.2", reward: "0.2" },
  { id: 6, img: dolar, label: "$ 0.05", reward: "0.05" },
  { id: 7, img: dolar3, label: "$5", reward: "5" },
  { id: 8, img: "https://img.icons8.com/?size=100&id=Bg0jJhTaGmhp&format=png&color=000000", label: "Good luck", reward: "Lucky_Clover" },
];

const LuckyWeel = () => {
  const { t } = useTranslation();
  const { user, onSetUser } = useAuthApp();
  const { handleCallbackUser } = useGlobalAppStore();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [itemWinner, setItemWinner] = useState<any>(null);
  const [openGuide, setOpenGuide] = useState(false);

  const getSpinSpeed = (step: number) => {
    if (step < 20) return 80;
    if (step < 40) return 100;
    if (step < 60) return 120;
    return 150;
  };

  const animateSpin = (targetIndex: number) => {
    const totalRounds = 3;
    const totalSteps = totalRounds * rewardItems.length + targetIndex;
    let currentIndex = 0;

    const spin = setInterval(() => {
      setActiveIndex(currentIndex % rewardItems.length);
      currentIndex++;

      if (currentIndex > totalSteps) {
        clearInterval(spin);
        setIsSpinning(false);
        setItemWinner(rewardItems[targetIndex]);
        handleCallbackUser();
      }
    }, getSpinSpeed(currentIndex));
  };

  const handleLuckyWell = async (drawMoney: boolean) => {
    if (isSpinning) return;
    setIsSpinning(true);
    setItemWinner(null);

    try {
      const res = await requestService.post("/checkin/draw", { data: { drawMoney } });
      const resultReward = res?.data?.data;

      if (drawMoney && user) {
        onSetUser({ ...user, realBalance: user.realBalance - 0.2 });
      }

      const targetIndex = rewardItems.findIndex(item => item.reward === resultReward);
      if (targetIndex === -1) throw new Error("Reward not found");

      animateSpin(targetIndex);
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: error?.response?.data?.message,
        duration: 2,
        placement: "top"
      })
      setIsSpinning(false);
    }
  };

  return (
    <div className='relative z-10' >
      <LuckyWheelGuide open={openGuide} onClose={() => setOpenGuide(false)} />
      <div className='mb-2 flex justify-between items-center'>
        <div>
          {t('Lượt quay')} : <span>{user?.drawNum || 0}</span>
        </div>
        <div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e77e29',
              textShadow: '2px 2px 4px #c9c2b8',
              cursor: 'pointer',
              userSelect: 'none',
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'rotate(-5deg)')}
            onClick={() => setOpenGuide(true)}
          >
            {t("Hướng dẫn")}
          </div>
        </div>
      </div>
      <div className="rotatebox " data-v-dd46357c="">
        <i
          className="van-badge__wrapper van-icon van-icon-arrow-left lefticon"

          data-v-dd46357c=""
        />
        <Modal open={!!itemWinner} footer={null} closable={false} centered className='modal_winner'>
          <div className="winner_container !max-w-[90rem] w-[90%] ">
            <h3 className="congratulation">
              {t("Congratulations")}!
            </h3>
            <p className="congratulation_pera">

              {t("Get cash rewords and receive them immediately in you account")}
            </p>

            {
              itemWinner?.label && <div>
                <>
                  <div className="discreate">
                    <img src={itemWinner?.img} width={100} />
                  </div>
                  <h3 className="receivedable_amount">{itemWinner?.label}</h3>
                </>

              </div>

            }

            <div style={{ textAlign: "center" }} className="mt-3">
              <button className="recBtn" onClick={() => setItemWinner(null)}>
                OK
              </button>
            </div>

          </div>
        </Modal>



        <div className="drawbox" data-v-dd46357c="">
          {
            rewardItems.map((item, index) => (
              <div className="drawAmountSize" key={index} data-v-dd46357c=""

              >
                <div className={`listcuct item${index + 1}`} data-v-dd46357c=""
                  style={{
                    // filter: activeIndex === index ? "drop-shadow(black 2px 4px 6px)" : 'none'
                    background: activeIndex === index ? `url(${actice_bg})` : "",

                  }}
                >
                  <div data-v-dd46357c="" className="flex flex-col justify-center items-center h-full">
                    <img
                      src={
                        item.img
                      }
                      className="!size-[30px]"
                      data-v-dd46357c=""

                    />
                    {
                      item.label && <p data-v-dd46357c="" className="!text-[9px]">{item.label}</p>
                    }

                  </div>
                </div>

              </div>
            ))
          }

          <button

            className="drawuis" data-v-dd46357c="" id="drawBtn" onClick={() => {
              handleLuckyWell(false)
            }}>
            <p data-v-dd46357c="" className="!text-[17px] !font-[900]">
              {t("Draw")}
            </p>
          </button>

        </div>
      </div>
    </div>

  )
}

export default LuckyWeel