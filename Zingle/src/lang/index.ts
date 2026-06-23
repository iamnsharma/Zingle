import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/common.json';
import es from './es/common.json';
import fr from './fr/common.json';

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export const t = i18n.t;
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
export default i18n;
