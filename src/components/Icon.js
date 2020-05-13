import styled from 'styled-components'

const type = {
  slash:      '\uE913'
  , save:      '\uE900'
  , revert:    '\uE901'
  , delete:    '\uE902'
  , file:      '\uE903'
  , duplicate: '\uE904'
  , add:       '\uE905'
  , sync:      '\uE909'
  , time:      '\uE906'
  , mark:      '\uE907'
  , github:    '\uE908'
  , brand:     '\uE908'
  , octacat:   '\uE908'
  , social:    '\uE908'
  , promile:   '\uE90a'
  , stop:      '\uE90b'
  , drag:      '\uE90c'
  , cog:       '\uE90d'
  , pencil:    '\uE90e'
  , close:     '\uE90f'
  , stack:     '\uE910'
  , money:     '\uE911'
  , eye:       '\uE912'
}

export const Icon = styled.i`
  @font-face {
    font-family: 'icomoon';
    src:
      url('/fonts/icomoon.ttf?ero3y5') format('truetype'),
      url('/fonts/icomoon.woff?ero3y5') format('woff'),
      url('/fonts/icomoon.svg?ero3y5#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
  }
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  &:before { content: '${props => type[props.type] || ''}'; }
`
