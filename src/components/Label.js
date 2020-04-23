import React from 'react'
import styled from 'styled-components'

const width = '73.5%' // aligned to col-sm-9 which should be 9/12 = 75% (whatever)

const Element = styled.label`
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  line-height: 1.875rem;
  &>.input,
  &>select,
  &>[type=checkbox],
  &>[type=checkbox]+span,
  &>button,
  &>a {
    float: right;
    position: relative;
    right: ${width};
    transform: translateX(100%);
    &.float-right {
      right: 0;
      transform: translateX(0);
    }
  }
  &>input, &>textarea, &>select, &>.input {
    float: right;
    width: ${width};
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

export const Label = attr => <Element {...attr}>{attr.children}</Element>
