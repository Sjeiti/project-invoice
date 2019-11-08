import React from 'react'
import styled from 'styled-components'

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
    right: 70%;
    transform: translateX(100%);
  }
  &>input, &>textarea {
    float: right;
    width: 70%;
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

export const Label = attr => <Element {...attr}>{attr.children}</Element>
