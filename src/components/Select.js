import React from 'react'
import styled from 'styled-components'
import {StyledInput} from './Input'

const StyledSelect = styled.select`
  ${StyledInput.componentStyle.rules}
  padding: 0.4375rem 0 0.4375rem 0.25rem;
  
`

export const Select = ({ value, onChange, setter, options }) => {
  return <StyledSelect value={value} onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})}>
    {options.map(({value, text}) => <option value={value} key={value}>{text}</option>)}
  </StyledSelect>
}
