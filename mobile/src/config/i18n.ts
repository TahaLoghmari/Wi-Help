import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import en from "@/locales/en/translation.json";
import fr from "@/locales/fr/translation.json";

const getDeviceLanguage = (): string => {
  try {
    return getLocales()[0]?.languageCode ?? "en";
  } catch {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "fr"],
  interpolation: { escapeValue: false },
});

export default i18n;
