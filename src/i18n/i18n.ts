import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import { en } from "@/i18n/locales/en";
import { es } from "@/i18n/locales/es";

export const supportedLanguages = ["en", "es"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

export const getSystemLanguage = (): SupportedLanguage => {
  const languageCode = getLocales().at(0)?.languageCode?.toLowerCase();

  return languageCode === "es" ? "es" : "en";
};

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  lng: getSystemLanguage(),
  react: { useSuspense: false },
  resources,
});

export default i18n;
