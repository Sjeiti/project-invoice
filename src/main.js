import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './directives/explain'
import './directives/middleEllipsis'
import {appUpdated} from './util/cache'
import {notify} from './util/signal'
import 'current-device'

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
  notify.dispatch('Project Invoice has just been updated<!-- to version xxxx -->')
  setTimeout(() => localStorage.removeItem('updated'),5000)
}