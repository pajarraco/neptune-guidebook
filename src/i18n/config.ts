import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Dynamically import all locale files
const localeModules = import.meta.glob("./locales/*.json", { eager: true });

// Build resources object from imported locales
const resources: Record<string, { translation: Record<string, unknown> }> = {};
for (const path in localeModules) {
  const match = path.match(/\.\/locales\/(.+)\.json$/);
  if (match) {
    const locale = match[1];
    resources[locale] = {
      translation: (localeModules[path] as { default: Record<string, unknown> })
        .default,
    };
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
