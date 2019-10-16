import React, { useState } from 'react'
import styled from 'styled-components'
import {color, formElement, icon} from '../cssService'

export const InputElement = styled.input`
  ${formElement}
  box-shadow: 0 0 0 1px ${color.colorBorder} inset,  0 4px 16px ${color.colorShade} inset;
  &[type=checkbox] {
    width: 0;
  height: 0;
    margin: 0;
    padding: 0;
    +span {
      ${formElement}
      display: inline-block;
      margin: 0;
      padding: 8px;
      overflow: hidden;
      background-color: #e8e8e8;
      box-shadow: inset 0 0 0 1px #bbb;
      color: #BBB;
      text-align: center;
      font-size: 1rem;
      &:before { 
        ${icon}
        content: '\uE907';
        color: inherit;
      }
    }
    &:checked+span { color: ${color.colorButton}; }
  }
`

export const InputText = attr => <InputElement {...attr} type="text" />

export const InputNumber = attr => <InputElement {...attr} type="number" />

export const InputBoolean = attr => <><InputElement {...attr} type="checkbox" /><span/></>

export const InputDate = attr => <InputElement {...attr} type="date" />

export const Input = props => {
  const { value, onChange, setter, ...attr } = props
  const [Element] = useState(() => {
    const isBoolean = value === true || value === false
    const isString = typeof value === 'string'
    const isNumber = typeof value === 'number'
    const isDate =
      (isString &&
        value.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) &&
        true) ||
      false
    // console.log('asdf', {value, isBoolean, isString, isNumber}) // todo: remove log
    return (
      (isBoolean && InputBoolean) ||
      (isNumber && InputNumber) ||
      (isDate && InputDate) ||
      (isString && InputText) ||
      InputElement
    )
  })
  return <Element value={value} onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})} {...attr} />
}


export const InputCheckbox = ({value, setter, onChange}) => {
  return <><InputElement
      onChange={onChange || setter && (({ target: { checked } }) => setter(checked)) || (() => {})}
      checked={value}
      type="checkbox"
  /><span/></>
}