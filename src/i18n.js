// src/i18n.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import es from './locales/es.json'

const i18n = createI18n({
  legacy: false, 
  locale:  localStorage.getItem('lang') ?  localStorage.getItem('lang'): 'es', 
  fallbackLocale: 'es',  
  messages: {
    en,
    es
  }
})

export default i18n