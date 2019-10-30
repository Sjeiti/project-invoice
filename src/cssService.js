
// todo temp solution, names and values should be same as _variables.scss


import {css} from 'styled-components'

export const breakpoint = {
  breakpoint: '598px'
  , breakpointLow: '(max-width: 598px)'
  , breakpointHigh: '(min-width: 599px)'
}

export const color = {
  colorButton: '#1d85b4'
  , colorShade: 'rgba(0,0,0,0.1)'
  , shadeFlat: '2px 3px 1px rgba(0, 0, 0, 0.2)'
  , colorBorder: '#BBB'
  , colorHeader: '#444'
  , colorTable: '#EEE'

  , colorRed: '#F04'
  , colorGray: '#CCC'
}

export const size = {
  headerHeight: '40px'
  ,padding: '8px'
  ,sum(...numbers){
    const unit = numbers[0].replace(/^\d+/, '')
    return numbers.reduce((acc, number)=>acc+(parseFloat(number.replace(/[^\d]+$/, ''))||0), 0) + unit;
  }
  ,multiply(...numbers){
    const unit = numbers[0].replace(/^\d+/, '')
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
  display: block;
  margin: 0 0.125rem 0.25rem 0;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 3px;
  line-height: 100%;
  font-family: inherit;
  font-size: inherit;
  &:focus {
    outline: none;
    border: 0;
  }
  &:last-child { margin-right: 0; }
`

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

export const absolute = (left, top) => ({position: 'absolute', left: `${left}rem`, top: `${top}rem`})