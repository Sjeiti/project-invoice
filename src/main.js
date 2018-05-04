import 'dialog-polyfill'
import 'dialog-polyfill/dialog-polyfill.css'
import 'current-device'

import Vue from 'vue'
import VueI18n from 'vue-i18n'

import App from './App.vue'
import router from './router'
import './directives/explain'
import './directives/middleEllipsis'
import {appUpdated} from './util/cache'
import {notify} from './components/Notification'
import {VERSION} from './config'

Vue.config.productionTip = false

//////////////////////////////////
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'nl'
  ,messages: {
    en: {
      message: {
        hello: 'hello world'
      }
      ,save: 'save'
      ,revert: 'revert'
      ,delete: 'delete'
    },nl: {
      message: {
        hello: 'hallo wereld'
      }
      ,save: 'bewaar'
      ,revert: 'herstel'
      ,delete: 'verwijder'
    }
  }
})
//////////////////////////////////

new Vue({
  router
  ,i18n
  ,render: h => h(App)
}).$mount('#app')

// checking service worker application cache

appUpdated.add(()=>{
  localStorage.updated = true
  location.reload()
})

if (localStorage.updated){
  notify(`Project Invoice has just been updated to version ${VERSION}`)
  setTimeout(() => localStorage.removeItem('updated'),5000)
}