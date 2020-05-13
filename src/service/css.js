import {css} from 'styled-components'
import Sass from 'sass.js/dist/sass'
import {camelCase} from '../util'

import '../style/_variables.scss'

const cssVars = Array.from(document.styleSheets).reduce((acc, sheet)=>{
  Array.from(sheet.cssRules).forEach(rule=>{
    const {selectorText, style} = rule
    if (selectorText===':root') {
      for (let i=0, l=style.length;i<l;i++) {
      	const key = style[i];
      	acc[key] = style.getPropertyValue(key)
      }
    }
  })
  return acc
}, {})

const cssVarDefault = {
  breakpoint: '598px'
  , breakpointLow: '(max-width: 598px)'
  , breakpointHigh: '(min-width: 599px)'
}

export const cssVar = Object.assign({}, cssVarDefault, Object.keys(cssVars).reduce((acc, key)=>{
  acc[camelCase(key.substr(2))] = `var(${key})`
  return acc
}, {}))

export const cssVarValue = Object.assign({}, cssVarDefault, Object.entries(cssVars).reduce((acc, [key, value])=>{
  acc[camelCase(key.substr(2))] = value
  return acc
}, {}))


export const clearfix = css` 
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

export const formElement = css`
  display: inline-block;
  margin: 0 0.25rem 0.25rem 0;
  padding: 0.5rem 0.75rem;
  vertical-align: top;
  border: 0;
  border-radius: 3px;
  line-height: 100%;
  font-family: inherit;
  font-size: inherit;
  &:focus {
    outline: none;
    border: 0;
  }
  &:last-child, &.float-right { margin-right: 0; }
`

export const absolute = (left, top) => ({position: 'absolute', left: `${left}rem`, top: `${top}rem`})

export const icon = css`
  font-family: icomoon;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const sassworker = new Sass('/static/js/sass.worker.js')
export const sass = {
  /**
   * Compiles a sass string
   * @param {string} sassString
   * @returns {Promise.<string>}
   */
  compile(sassString){
    return new Promise((resolve, reject)=>{
      sassworker.compile(sassString, ({status, text})=>{
        if (status===0){
          resolve(text)
        } else {
          reject()
        }
      })
    })
  }
}