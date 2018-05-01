import 'dialog-polyfill'
import 'dialog-polyfill/dialog-polyfill.css'
import 'current-device'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import './directives/explain'
import './directives/middleEllipsis'
import './directives/i18n'
import {appUpdated} from './util/cache'
import {notify} from './components/Notification'
import {VERSION} from './config'

Vue.config.productionTip = false

new Vue({
  router
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

//__('client')__('description')__('changed')
