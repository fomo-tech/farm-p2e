import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile: any;
  }
}

const TurnstileCaptcha = ({ onToken }: { onToken: (token: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sitekey = process.env.REACT_APP_SITE_KEY || "0x4AAAAAABglGz0Dr0_PfZB3"; // fallback cho test

    const renderCaptcha = () => {
      if (window.turnstile && ref.current) {
        const widgetId = window.turnstile.render(ref.current, {
          sitekey,
          callback: onToken,
          theme: "light",
        });

        return () => {
          window.turnstile.remove(widgetId);
        };
      }
    };

    if (window.turnstile) {
      return renderCaptcha();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderCaptcha;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center p-4">
      <div ref={ref} />
    </div>
  );
};

export default TurnstileCaptcha;
