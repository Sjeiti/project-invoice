import React from 'react'
import styled from 'styled-components'
import {noop} from '../utils'
import {color, formElement, icon} from '../cssService'

export const StyledInput = styled.input`
  ${formElement}
  box-shadow: 0 0 0 1px ${color.colorBorder} inset,  0 4px 16px ${color.colorShade} inset;
  &[type=checkbox] {
    width: 0;
    height: 0;
    margin: 0!important;
    padding: 0;
    +span {
      ${formElement}
      display: inline-block;
      padding: 0.5rem;
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

export const InputText = ({ value, onChange:_onChange, setter, ...attr}) => {
  return <StyledInput
      value={value}
      onChange={_onChange || setter && (({ target: { value } }) => setter(value)) || noop}
      {...attr}
      type="text"
  />
}

export const InputDate = ({ value, onChange:_onChange, setter, ...attr}) => {
  return <StyledInput
      value={value}
      onChange={_onChange || setter && (({ target: { value } }) => setter(value)) || noop}
      {...attr}
      type="date"
  />
}

export const InputNumber = ({ value, onChange:_onChange, setter, ...attr}) => {
  return <StyledInput
      value={value}
      onChange={_onChange || setter && (({ target: { value } }) => setter(parseFloat(value))) || noop}
      {...attr}
      type="number"
  />
}

export const InputCheckbox = ({value, setter, onChange, ...attr}) => {
  return <><StyledInput
      onChange={onChange || setter && (({ target: { checked } }) => setter(checked)) || noop}
      checked={value}
      {...attr}
      type="checkbox"
  /><span onClick={attr.onClick||noop} /></>
}