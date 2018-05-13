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

//$t('date')
//$t('description')
//$t('total')
//$t('VAT')
//$t('paid')
//$t('actions')
//$t('quotationDate')
//$t('quotationDuration')
//$t('quotationStartDate')
//$t('quotationSubject')
//$t('quotationBefore')
//$t('quotationAfter')
//$t('add')

//$t('name')
//$t('address')
//$t('zipcode')
//$t('city')
//$t('phone')
//$t('vatNumber')
//$t('kvkNumber')
//$t('bank')
//$t('iban')
//$t('bic')
//$t('bankName')
//$t('country')
//$t('reminderPeriod')
//$t('vatAmounts')
//$t('interestAmount')
//$t('administrationCosts')
//$t('terms')
//$t('email')
//$t('website')
//$t('blog')
//$t('hourrateMin')
//$t('hourrateMax')
//$t('hoursMin')
//$t('hoursMax')

//$t('copy')
//$t('sender')
//$t('receiver')
//$t('footer')
//$t('reminder1')
//$t('reminder2')
//$t('exhortation_')
//$t('dateFormat')
//$t('vat')
//$t('pagebreak')
//$t('legalInterest')
//$t('finally')