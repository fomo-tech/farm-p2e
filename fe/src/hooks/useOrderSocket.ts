import { socket } from "lib/socket";
import { useEffect } from "react";


export default function useOrderSocket(
  orderId: string,
  userId?: string,
  setData?: Function
) {
  useEffect(() => {
    if (!socket || !userId || !orderId || !setData) return;

    const handleEmit = (val: any) => setData(val);

    socket.on("emitOrderDetail", handleEmit);

    return () => {
      socket.off("emitOrderDetail", handleEmit);
    };
  }, [orderId, userId]);
}
