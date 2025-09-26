declare global {
  interface Window {
    $crisp: any; // Hoặc có thể thay `any` bằng kiểu rõ ràng hơn nếu cần
    CRISP_WEBSITE_ID: string;
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
    turnstile: {
      render: (container: HTMLElement, options: any) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export {};
