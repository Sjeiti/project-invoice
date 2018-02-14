import Sass from 'sass.js/dist/sass.js'
import {sassChanged, sassCompiled, cssVariablesChanged} from '@/signals'
import model from '@/model'

let css = ''
const style = document.createElement('style')
style.setAttribute('id','invoiceCSS')
const sass = new Sass('/static/js/sass.worker.js')

cssVariablesChanged.add(setStyle)
sassChanged.add(sassCompile)

sassCompile()

/**
 * Compiles a sass string
 * @param sassString
 */
function sassCompile(sassString){
  sass.compile(sassString||model.config.invoiceCSS, onSassCompiled)
}

/**
 * Sass was compiled and is stored to style element, localStorate and dispatched
 * @param {number} status
 * @param {string} text
 */
function onSassCompiled({status, text}){
  if (status===0){
    setStyle(text)
    localStorage.setItem('css', text)
    // sassCompiled.dispatch(text)
  }
}

/**
 * CSS is set onto the style element
 * @param {string} _css
 * @param {config} settings
 */
function setStyle(_css, settings) {
  if (_css){
    css = _css
  }
  if (!settings){
    settings = model.config
  }
  style.textContent = `html {
    --main-bg-color: ${settings.themeMainBgColor};
    --main-fg-color: ${settings.themeMainFgColor};
    --secondary-bg-color: ${settings.themeSecondaryBgColor};
    --secondary-fg-color: ${settings.themeSecondaryFgColor};
  }
  ${settings.themeLogoCSS||''}
  ${css}`
  //
  sassCompiled.dispatch(style.textContent)
}

/**
 * Style is appended to a parent element
 * @param {HTMLElement} elm
 */
export function appendStyle(elm) {
  elm.appendChild(style)
}