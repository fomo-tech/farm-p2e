import requestService from "api/request";
import { socket } from "lib/socket";
import { useEffect, useRef, useState } from "react";

export default function useOrderDetail(
  orderId: string,
  user: any,
  navigate: any
) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!orderId || !user?._id) return;
    firstLoad.current = true;

    const getOrderDetail = async () => {
      if (firstLoad.current) setLoading(true);
      try {
        const res = await requestService.get("/tickets/order/" + orderId);
        if (res?.data) {
          setData(res.data.data);
          socket.emit("fetchOrderDetail", {
            orderId,
            userId: user?._id,
          });
        }
      } catch (err) {
        navigate("/order");
      } finally {
        if (firstLoad.current) {
          timeoutRef.current = setTimeout(() => {
            setLoading(false);
            firstLoad.current = false;
          }, 1200);
        }
      }
    };

    getOrderDetail();

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [orderId, user?._id]);

  return { data, loading, setData };
}
