import { createI18n } from 'vue-i18n';
import en from './en-US';
import th from './th-TH';

const languages = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'ภาษาไทย',
    value: 'th',
  },
];

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    th,
  },
});

export default i18n;
