import React from 'react'
import styled from 'styled-components'

const Element = styled.label`
  display: block;
  margin: 0;
  padding: 0;
  & select, & [type=checkbox]+span {
    float: right;
  }
  & input, & textarea {
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
