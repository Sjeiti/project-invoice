import Vue from 'vue'
import VueI18n from 'vue-i18n'

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
            ,language: 'language'
            ,home: 'home'
            ,overview: 'overview'
            ,quarter: 'quarter'
            ,clients: 'clients'
            ,settings: 'settings'
            ,layout: 'layout'
            ,data: 'data'
            ,copy: 'copy'
            ,about: 'about'
        }/*,nl: {
            message: {
                hello: 'hallo wereld'
            }
            ,save: 'bewaar'
            ,revert: 'herstel'
            ,delete: 'verwijder'
            ,language: 'taal'
            ,home: 'home'
            ,overview: 'overzicht'
            ,quarter: 'kwartaal'
            ,clients: 'klanten'
            ,settings: 'instellingen'
            ,layout: 'opmaak'
            ,data: 'data'
            ,copy: 'tekst'
            ,about: 'over'
        }*/
    }
})

fetch('/static/i18n/nl.json')
    .then(res=>res.json())
    .then(nl=>{
        // console.log('nl',nl) // todo: remove log
        i18n.setLocaleMessage('nl',nl)
        i18n.locale = 'en'
        i18n.locale = 'nl'
    })

export default i18n

// $t('client')
// $t('description')
// $t('changed')
