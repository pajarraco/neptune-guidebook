import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// List of supported languages is provided at build time via VITE_LANGUAGES.
// Locale JSON files are NOT bundled — they are fetched at runtime from
// `/locales/{lng}.json`, which on Coolify is served from a persistent volume.
const supportedLngs = (import.meta.env.VITE_LANGUAGES || "en")
  .split(",")
  .map((l: string) => l.trim())
  .filter(Boolean);

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
      // The server gates /locales/* behind this header. The code is the
      // same one the user enters in CodeEntryModal — it lives in the
      // bundle so a determined attacker can extract it, but this stops
      // the JSON files from being scraped by bots / random visitors.
      customHeaders: () => ({
        "x-access-code": import.meta.env.VITE_CODE || "",
      }),
    },
    supportedLngs,
    fallbackLng: "en",
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
