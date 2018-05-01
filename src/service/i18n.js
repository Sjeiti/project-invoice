import Vue from 'vue'
import {signal} from '../util/signal'
import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer()
  ,gfm: true
  ,tables: true
  ,breaks: true // false,
  ,pedantic: false
  ,sanitize: false
  ,smartLists: true
  ,smartypants: false
})

let lang = 'nl'
let langObject = {}

export const loaded = signal()

loadLang(getFileUri(lang))
    .then(()=>loaded.dispatch())

Vue.directive('__',{
  bind(el,binding){
    const hasBindingValue = !!binding.value
    const key = binding.value||el.firstChild&&el.firstChild.textContent
    const translate = hasBindingValue&&(()=>el.innerHTML = marked(__(key)))||(()=>el.firstChild.textContent = __(key))
    translate()
    loaded.add(translate)
  }
})

/**
 * Load the language file
 * @param {string} uri
 * @returns {object}
 */
function loadLang(uri){
  return fetch(uri)
      .then(res=>res.json())
      .then(res=>langObject = res)
}

/**
 * Get the uri
 * @param {string} lang
 * @returns {string}
 */
function getFileUri(lang){
  return `/static/i18n/${lang}.json`
}

/**
 * Main translate method
 * @param {string} s
 * @returns {string}
 * @private
 */
export function __(s){
  return langObject.hasOwnProperty(s)?langObject[s]:s
}

export default {
  __
}