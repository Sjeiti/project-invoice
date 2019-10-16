import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import {store} from './model/store'
import en from '../public/static/i18n/en'
import nl from '../public/static/i18n/nl'
import aboutEn from '../public/static/i18n/About-en.html'
import aboutNl from '../public/static/i18n/About-nl.html'

const {config:{uilang}} = store.getState()

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: Object.assign(en, {pageAbout:aboutEn}) }
      , nl: { translation: Object.assign(nl, {pageAbout:aboutNl}) }
    }
    , lng: uilang||'en'
    , fallbackLng: 'en'
    , debug: true
    , interpolation: {
      escapeValue: false
    }
    , react: {
      transSupportBasicHtmlNodes: true
      , transKeepBasicHtmlNodesFor: 'div,section,br,strong,em,p,h1,h2,h3,code,dl,dt,dd,ul,li,a'.split(',')
    }
  })