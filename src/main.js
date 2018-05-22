import 'dialog-polyfill'
import 'dialog-polyfill/dialog-polyfill.css'
import 'current-device'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

import './directives/_'
import './directives/title'
import './directives/middleEllipsis'
import {appUpdated} from './util/cache'
import {notify} from './components/Notification'
import {VERSION} from './config'

Vue.config.productionTip = false

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
