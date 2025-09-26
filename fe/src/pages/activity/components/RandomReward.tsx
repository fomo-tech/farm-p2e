import j120 from 'assets/images/boom_v2 copy.png'

const RandomReward = () => {

  const rewardItems = [
    { id: 1, img: "/icons/diamond-icon.svg", label: "$0.05", reward: "0.05" },
    { id: 2, img: "/icons/diamond-icon.svg", label: "$0.1", reward: "0.1" },
    { id: 3, img: "/icons/diamond-icon.svg", label: "$0.2", reward: "0.2" },
    { id: 4, img: "/icons/diamond-3.svg", label: "$0.5", reward: "0.5" },
    { id: 5, img: "/icons/diamond-5.svg", reward: "1", label: "$1" },
    { id: 6, img: "/icons/diamond-6.svg", reward: "5", label: "$5" },
    { id: 7, img: j120, reward: "lucky" },
    { id: 8, img: j120, reward: "lucky" },
    { id: 9, img: j120, reward: "lucky" },

  ];

  const randomRewardBox = () => {
    // Chọn một ID ngẫu nhiên trong phạm vi từ 0 đến 9
    let randomIndex = Math.floor(Math.random() * 9); // ID từ 0 đến 9
    return randomIndex;
  };

  const index = randomRewardBox()
  return (
    <div className="mine-box-wrapper">
      <div className="mine-box-front">
        <img
          src={rewardItems[index]?.img}
          alt="image"
          className='animation-bounceCard !w-[8rem] !h-[8rem]'

        />
        {
          rewardItems[index]?.label &&
          <div className='text-[2.5rem] text-[#000] font-[700]'>
            {rewardItems[index]?.label}
          </div>
        }
      </div>


      <div className="mine-box-hidden" />
    </div>
  )
}

export default RandomReward