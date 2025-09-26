import vip_0 from 'assets/images/vip-0.png';
import vip_1 from 'assets/images/vip-1.png';
import vip_2 from 'assets/images/vip-2.png';
import vip_3 from 'assets/images/vip-3.png';
import vip_4 from 'assets/images/vip-4.png';
import vip_5 from 'assets/images/vip-5.png';

export const renderVip = (farmVip: number) => {
  switch (farmVip) {
    case 1:
      return vip_1;
    case 2:
      return vip_2;
    case 3:
      return vip_3;
    case 4:
      return vip_4;
    case 5:
      return vip_5;
    default:
      return vip_0;
  }
};
