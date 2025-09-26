import { useEffect, useState } from 'react';
import { useAuthApp } from 'store/useAuthApp';
import { useGlobalAppStore } from 'store/useGlobalApp';
import requestService from 'api/request';
import Land from './Land';
import { useTranslation } from 'react-i18next';
import { CountdownRenderProps } from 'react-countdown';
import { socket } from 'lib/socket';

const HomeFarm = () => {
  const { handleLoading } = useGlobalAppStore();
  const { user } = useAuthApp();
  const [orders, setOrders] = useState([]);
  const currentUnlockedIndex = user?.currentUnlockedIndex || 1;
  const { t } = useTranslation()
  // Gọi API lấy order
  const getOrders = async () => {
    handleLoading(true);
    try {
      const res = await requestService.get('/tickets/orders');
      if (res?.data) {
        setOrders(res.data?.data);
        // socket.emit("getOrders", { userId: user?._id });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    handleLoading(false);
  };

  useEffect(() => {
    if (user?._id)
      getOrders();
  }, [user?._id]);

  // Trả về props cho mỗi Land
  const getLandProps = (idx: number) => {
    if (idx <= currentUnlockedIndex) return {};
    if (idx === currentUnlockedIndex + 1) return { isMark: true, isLock: true };
    return { isLock: true, isShowLock: true };
  };

  // Mảng định nghĩa vị trí land trên lưới 5x5 (index từ 1 đến 9)
  const layoutMap: (number | null)[][] = [
    [null, null, null, null, null],         // Row 1
    [null, 1, 2, 3, null],                  // Row 2
    [null, 4, 5, 6, null],                  // Row 3
    [null, 7, 8, 9, null],                  // Row 4
    [null, null, null, null, null],         // Row 5
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("getOrders", { userId: user?._id });
    }, 1000); // 3 giây 1 lần hoặc tùy bạn

    socket.on("emitOrders", (data) => {
      setOrders(data);
    });

    return () => {
      clearInterval(interval);
      socket.off("emitOrders");
    };
  }, [user?._id]);


  return (
    <div className="grid grid-cols-5 gap-1 w-full h-full rotate-45 origin-center">
      {layoutMap.flat().map((idx, i) => {
        if (!idx) {
          return <div key={i}></div>; // Ô trống
        }

        const order = orders?.[idx - 1];
        const props = getLandProps(idx);

        return (
          <Land
            key={`${idx}-${i}`}
            {...props}
            order={order}
          />
        );
      })}
    </div>
  );
};

export default HomeFarm;
