import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

Vue.config.productionTip = false

// Vue.filter('currency', val => `€ ${val.toFixed(2)}`)
Vue.filter('currency', val => val&&val.toFixed(2)||0)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
