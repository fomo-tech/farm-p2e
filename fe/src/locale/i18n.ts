import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./translation/en.json";
import viTranslation from "./translation/vi.json";
import zhTranslation from "./translation/zh.json";
// Khởi tạo i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    vi: {
      translation: viTranslation,
    },
    zh: {
      translation: zhTranslation,
    },
  },
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
