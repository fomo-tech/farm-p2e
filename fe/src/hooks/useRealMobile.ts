import { useEffect, useState } from "react";

function useRealMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const screenWidth = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /android|iphone|ipad|ipod/.test(userAgent);
      const isFakeViaF12 = screenWidth < 768 && !isTouch;

      setIsMobile(isMobileUA && isTouch && !isFakeViaF12);
    };

    check();
  }, []);

  return isMobile;
}
export default useRealMobile;