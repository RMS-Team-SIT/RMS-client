import { createI18n } from 'vue-i18n';
import en from './en-US';
import th from './th-TH';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    th,
  },
});

export default i18n;
