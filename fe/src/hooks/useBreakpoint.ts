import { useEffect, useState } from "react";

type BreakpointType = "mobile" | "tablet" | "desktop";

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointType | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setBreakpoint("mobile");
      } else if (window.innerWidth < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
