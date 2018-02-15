import Sass from 'sass.js/dist/sass.js'
import {signal} from '@/signals'
import model from '@/model'

export const sassChanged = signal()
export const cssVariablesChanged = signal()

export const cssCompiled = signal()

let cssVariables = ''
let sassCompiled = ''
let css = localStorage.getItem('css')||''
const style = document.createElement('style')
style.setAttribute('id','invoiceCSS')
style.textContent = css

const sass = new Sass('/static/js/sass.worker.js')

// await initial compilation before adding signal bindings
Promise.all([
  sassCompile()
  ,updateVariables()
])
    .finally(()=>{
      setStyle()
      sassChanged.add(s=>sassCompile(s).then(setStyle))
      cssVariablesChanged.add(s=>updateVariables(s).then(setStyle))
    })

/**
 * Compiles a sass string
 * @param sassString
 * @returns {Promise.<string>}
 */
function sassCompile(sassString){
  return new Promise((resolve,reject)=>{
    sass.compile(sassString||model.config.invoiceCSS, ({status, text})=>{
      if (status===0){
        sassCompiled = text
        resolve(text)
      } else {
        reject()
      }
    })
  })
}

/**
 * Updates the variables css
 * @param settings
 * @returns {Promise.<string>}
 */
function updateVariables(settings){
  if (!settings) settings = model.config
	cssVariables = `html {
    --main-bg-color: ${settings.themeMainBgColor};
    --main-fg-color: ${settings.themeMainFgColor};
    --secondary-bg-color: ${settings.themeSecondaryBgColor};
    --secondary-fg-color: ${settings.themeSecondaryFgColor};
  }
  ${settings.themeLogoCSS||''}`
  return Promise.resolve(cssVariables)
}

/**
 * CSS is set onto the style element
 */
function setStyle() {
  css = `${cssVariables}${sassCompiled}`
  style.textContent = css
  localStorage.setItem('css', css)
  cssCompiled.dispatch(css)
}

/**
 * Style is appended to a parent element
 * @param {HTMLElement} elm
 */
export function appendStyle(elm) {
  elm.appendChild(style)
}