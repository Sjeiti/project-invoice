
// todo temp solution, names and values should be same as _variables.scss


import {css} from 'styled-components'
import Sass from 'sass.js/dist/sass'

export const breakpoint = {
  breakpoint: '598px'
  , breakpointLow: '(max-width: 598px)'
  , breakpointHigh: '(min-width: 599px)'
}

export const color = {
  colorButton: '#1d85b4'
  , colorLightBg: '#D9E6E8'
  , colorShade: 'rgba(0,0,0,0.1)'
  , shadeFlat: '2px 3px 1px rgba(0, 0, 0, 0.2)'
  , colorBorder: '#BBB'
  , colorHeader: '#444'
  , colorTable: '#EEE'

  , colorRed: '#F04'
  , colorGray: '#CCC'
}

export const font = {
  mono: '\'Source Code Pro\', monospace'
  ,main: '\'Open Sans\', sans-serif'
}

export const size = {
  headerHeight: '2.5rem'
  ,padding: '0.5rem'
  ,borderRadius: '0.125rem'
  ,sum(...numbers){
    const unit = numbers[0].replace(/^\d+/, '')
    return numbers.reduce((acc, number)=>acc+(parseFloat(number.replace(/[^\d]+$/, ''))||0), 0) + unit;
  }
  ,multiply(...numbers){
    const unit = numbers[0].replace(/^\d+(\.\d+)?/, '')
    // console.log('unit',unit) // todo: remove log
    return numbers.reduce((acc, number)=>acc*(typeof number === 'number' ? number : (parseFloat(number.replace(/[^\d]+$/, ''))||0)), 1) + unit;
  }
}

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
    return new Promise((resolve,reject)=>{
      sassworker.compile(sassString,({status,text})=>{
        if (status===0){
          resolve(text)
        } else {
          reject()
        }
      })
    })
  }
}