import {signal} from '../util/signal'

let lang = 'nl'
let langObject = {}

export const loaded = signal()

loadLang(getFileUri(lang))
    .then(()=>loaded.dispatch())

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