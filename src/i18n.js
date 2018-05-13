import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from 'json-loader!../public/static/i18n/en.json'
import model from './model'
import { modelSaved } from './formState'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'en'
    ,messages: {en}
    ,silentTranslationWarn: true // todo only on develop
})

testConfig()
modelSaved.add(testConfig)

/**
 * Read current uilang from config and set locale
 */
function testConfig(){
  const {uilang} = model.config
  uilang!==i18n.locale&&setLocateTo(uilang)
}

/**
 * Sets the locale to iso
 * @param {string} iso
 */
function setLocateTo(iso){
  if (i18n.messages[iso]){
    i18n.locale = iso
  } else {
    fetch(`/static/i18n/${iso}.json`)
        .then(res=>res.json())
        .then(result=>{
          i18n.setLocaleMessage(iso,result)
          i18n.locale = iso
        })
  }
}

export default i18n

// $t('client')
// $t('changed')

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

//$t('thisClientHasNoProjects')
//$t('noProjectsInThisQuarter')

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

//$t('projectNumberTemplateExplain')
//$t('csvTemplateExplain')
//$t('languagesExplain')
//$t('dataExplain')
//$t('cloudExplain')

//$t('addReminder')
//$t('invoice')
//$t('reminder')

//$t('legalInterestWasAdded')
//$t('finalExhortation')
