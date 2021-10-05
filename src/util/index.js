import { isEqual as _isEqual } from 'lodash'
import React from 'react'
import {TODAY} from '../config'
import {data as defaultData} from '../model/default'
import {project as enhanceProject} from '../model/clients/project'
import {CURRENCY_ISO} from '../config/currencyISO'

/**
 * Return the date part of the ISO date string (yyyy-mm-dd)
 * @param {string} [date]
 */
export function getDateString(date){
  return (date || TODAY)
    .toISOString()
    .split('T')
    .shift()
}

/**
 * Facade onto lodash isEqual with option to ignore specific keys
 * @param {object} source
 * @param {object} target
 * @param {string[]} [ignoreKeys=[]]
 */
export function isEqual(source, target, ignoreKeys = []){
  const ignore = ignoreKeys.reduce((acc, key) => ((acc[key] = true), acc), {})
  return _isEqual({ ...source, ...ignore }, { ...target, ...ignore })
}

/**
 * A noop
 */
export const noop = () => {}

/**
 * Non breaking space
 */
export const nbsp = '\u00A0'

/**
 * Test if value is a function
 * @param fn
 * @return {boolean}
 */
export function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]';
}

/**
 * Get the getter function that sets the key/value onto a model
 * @param {object} data
 * @param {Function} setter
 * @return {function(*=): function(*): *}
 */
export function getGetSetter(data, setter){
  const newData = {...data}
  return key => value => (
    newData[key] = value
    , setter(newData)
  )
  // return key => value =>
  //     setter({...data, ...[key, value].reduce((acc, v)=>(acc[key]=v, acc), {})})
}

/**
 * Updates the variables css
 * @param {config} config
 * @returns {Promise.<string>}
 */
export function getCSSVariables(config){
  const cssVariables = `html {
    --main-bg-color: ${config.themeMainBgColor};
    --main-fg-color: ${config.themeMainFgColor};
    --secondary-bg-color: ${config.themeSecondaryBgColor};
    --secondary-fg-color: ${config.themeSecondaryFgColor};
    --font-main: "${config.themeFontMain}", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --font-currency: "${config.themeFontCurrency}", monospace;
    --base-font-size: ${config.themeFontSize}px;
  }
  ${config.themeLogoCSS||''}`
  return cssVariables
}

/**
 * Safe interpolation
 * @param {string} text
 * @param {object} context
 * @param {RegExp} pattern
 * @return {string}
 */
export function interpolate(text, context, pattern = /\$\{(.+?)\}/g) {
  return text.replace(pattern, (_, key) => {
    let value = context
    for (const p of key.split('.')) value = value[p] || ''
    //
    const result = value||''
    const remaining = result&&result.match&&result.match(pattern)
    //
    return remaining&&remaining.length&&interpolate(result, context, pattern)||result
  })
}

/**
 * Evil interpolation
 * @param {string} text
 * @param {object} context
 * @return {string}
 */
export function interpolateEvil(text, context) {
  let evilResult
  try {
    const keys = Object.keys(context)
    const values = Object.values(context)
    evilResult = (new Function(...keys, 'return `'+text+'`'))(...values) // eslint-disable-line no-new-func
  } catch (err) { /* typing interpolations strings always produces errors */ }
  return evilResult||text
}

export function getInterpolationContext(state){
  const {config, config: {lang}, personal:data, copy:rawCopy} = state
  const copy = Object.entries(rawCopy).reduce((acc, [key, value])=>(acc[key] = value[lang], acc), {})
  const client = defaultData.clients[0]
  const project = enhanceProject(client.projects[0], {_client:client, model:state})
  const invoice = project.invoices[0]
  const {symbol} = CURRENCY_ISO[config.currency]
  const boundCurrency = f=>currency(f, symbol+' ', 2, '.', ',')
  return {
    client
    , project
    , invoice
    , data
    , copy
    , currency: boundCurrency
  }
}

/**
 * Deepfreeze from MDN
 * @param {object} object
 * @return {ReadonlyArray<any>}
 */
export function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object)
  for (let name of propNames) {
    let value = object[name]
    if (!Object.isFrozen(object[name])) {
      object[name] = value && typeof value==='object'
          ?deepFreeze(value)
          :value
    }
  }
  return Object.freeze(object)
}

/**
 * Add key to array of nodes
 * Since this clones you should preferably cache by `useState(()=>[...])`
 * @param {ReactElement} node
 * @param {number} key
 * @return {ReactElement|Node}
 */
export function keyMap(node, key){
	return React.isValidElement(node) && React.cloneElement(
    node, Object.assign({}, node.props, {key} )
  ) || node
}

/**
 * Stop event propagation
 * @param {Event} e
 */
export function stopPropagation(e){
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}

/**
 * JSON parse wrapped in try catch
 * @param {string} str
 * @returns {object}
 */
export function tryParse(str){
  let obj
  try {
    obj = JSON.parse(str)
  } catch(err){
    console.warn('err', err) // eslint-disable-line no-console
  }
  return obj
}

/**
 * JSON stringify wrapped in try catch
 * @param {object} obj
 * @returns {string}
 */
export function tryStringify(obj){
  let stringData
  try {
    stringData = JSON.stringify(obj)
  } catch(err){
    console.warn('err', err) // eslint-disable-line no-console
  }
  return stringData
}

/**
 * Unique method for Array.prototype.filter
 * @param {object} val
 * @param {number} ind
 * @param {Array} arr
 * @return {boolean}
 */
export const unique = (val, ind, arr) => arr.indexOf(val) === ind

/**
 * Read the getters from an Object
 * @param {object} obj
 * @return {string[]}
 */
export function readGetters(obj) {
  const desc = Object.getOwnPropertyDescriptors(obj)
  return Object.entries(desc).map(([key, value]) => value.get && key).filter(o=>o)
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const nextTick = window.requestAnimationFrame

/**
 * Promise all watch several properties
 * @param {object} vm
 * @param {string[]} props
 * @returns {Promise}
 */
export function watchAll(vm, ...props){
  return Promise.all(props.map(key=>new Promise(resolve=>{
         const unwatch = vm.$watch(key, ()=>{
           unwatch()
           resolve()
           return vm[key]
         })
       })
     ))
}

/**
 * @param {number} value
 * @param {string} currencySign
 * @param {number} decimalLength
 * @param {string} chunkDelimiter
 * @param {string} decimalDelimiter
 * @param {number} chunkLength
 * @returns {string}
 */
export function currency(
    value,
    currencySign = '€ ',
    decimalLength = 2,
    chunkDelimiter = '<span class="chunk" char="."></span>',
    decimalDelimiter = '<span class="decimal" char=",">.</span>',
    chunkLength = 3
){
  let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength>0 ? '\\D' : '$') + ')'
      , num = value.toFixed(Math.max(0, ~~decimalLength))
  return currencySign + (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter)
}

/**
 * Object assign but only when key does not yet exist
 * @param {object} obj
 * @param {object[]} adds
 * @returns {object}
 */
export function weakAssign(obj, ...adds){
  adds.forEach(add=>{
    for (let key in add){
      if (!obj.hasOwnProperty(key)){
        obj[key] = add[key]
      }
    }
  })
  return obj
}

/**
 * Async memoisation
 * @param {function} method
 * @return {function}
 */
export function memoizeAsync(method) {
    let cache = {}
    return async function() {
        let args = JSON.stringify(arguments)
        cache[args] = cache[args] || method.apply(this, arguments)
        return cache[args]
    }
}

/**
 * More an array item
 * @param {Array} arr
 * @param {number} from
 * @param {number} to
 * @return {Array}
 */
export function moveArrayItem(arr, from, to) {
  const clone = arr.slice(0)
  clone.splice(to, 0, clone.splice(from, 1)[0])
  return clone
}

/**
 * Returns the string with the first character to uppercase
 * @param {string} s
 * @returns {string}
 */
export function capitalise(s){
  return s[0].toUpperCase()+s.substr(1)
}

/**
 * Turn space or dash delimited string into kebab cas
 * @param {string} s
 * @return {string}
 */
export function camelCase(s) {
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i)=>
    i===0 ? w.toLowerCase() : w.toUpperCase()
  ).replace(/[\s-]+/g, '');
}

/**
 * Dynamically load a javascript file
 * @param {string} src
 * @returns {Promise}
 */
export function loadScript(src){
  return new Promise((resolve/*,reject*/)=>{
    const script = document.createElement('script')
    document.body.appendChild(script)
    script.setAttribute('src', src)
    script.addEventListener('load', resolve)
  })
}

/**
 * Create and append an element
 * @param {string} [type]
 * @param {HTMLElement} [parent]
 * @param {string[]} [classes]
 * @return {HTMLElement}
 */
export function appendChild(type, parent, classes){
  const elm = document.createElement(type||'div')
	classes&&elm.classList.add(...Array.isArray(classes)&&classes||[classes])
  parent&&parent.appendChild(elm)
  return elm
}

const scrollbarSizeKey = 'scrollbarSize'

/**
 * Get the scrollbar size from localStorage or do a DOM calculation over two ticks
 * @returns {Promise}
 */
export function getScrollbarSize(){
  return new Promise(resolve => {
    let scrollbarSize = localStorage.getItem(scrollbarSizeKey)
    if (!scrollbarSize){
      scrollbarSize = {width: 0, height: 0}
      const element = document.createElement('div')
      const elementStyle = element.style
      Object.assign(elementStyle, {
        width: '100px', height: '100px'
      })
      const child = document.createElement('div')
      Object.assign(child.style, {
        width: '100%', height: '100%'
      })
      element.appendChild(child)
      document.body.appendChild(element)
      setTimeout(() => {
        scrollbarSize.width = child.offsetWidth
        scrollbarSize.height = child.offsetHeight
        elementStyle.overflow = 'scroll'
        setTimeout(() => {
          scrollbarSize.width -= child.offsetWidth
          scrollbarSize.height -= child.offsetHeight
          localStorage.setItem(scrollbarSizeKey, JSON.stringify(scrollbarSize))
          resolve(scrollbarSize)
          element.parentNode.removeChild(element)
        })
      })
    } else {
      resolve(JSON.parse(scrollbarSize))
    }
  })
}

const {body} = document
const {classList} = body
const scrollLock = 'scroll-lock'
getScrollbarSize().then(result => {
  const sheet = document.styleSheets[0]
  sheet.insertRule(`.${scrollLock} {
    overflow: hidden;
    padding-right: ${result.width}px;
  }`, 0)
  sheet.insertRule(`.${scrollLock} #app>header {
    max-width: calc(100vw - ${result.width}px);
  }`, 0)
})
export const scroll = {
  lock: DOMTokenList.prototype.add.bind(classList, scrollLock)
  , unlock: DOMTokenList.prototype.remove.bind(classList, scrollLock)
}

