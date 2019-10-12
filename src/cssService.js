
// todo temp solution, names and values should be same as _variables.scss


import {css} from 'styled-components'

export const color = {
  colorButton: '#1d85b4'
  , colorShade: 'rgba(0,0,0,0.1)'
  , shadeFlat: '2px 3px 1px rgba(0, 0, 0, 0.2)'
}

export const clearfix = css`
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

export const absolute = (left, top) => ({position: 'absolute', left: `${left}rem`, top: `${top}rem`})