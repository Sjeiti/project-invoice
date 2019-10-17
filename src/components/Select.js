import React from 'react'
import styled from 'styled-components'
// import {formElement} from '../cssService'
import {StyledInput} from './Input'

// export const Select = styled.select`${InputElement.componentStyle.rules}`
const StyledSelect = styled.select`
  ${StyledInput.componentStyle.rules} 
`

export const Select = ({ value, onChange, setter, options }) => {
  return <StyledSelect value={value} onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})}>
    {options.map(({value, text}) => <option value={value} key={value}>{text}</option>)}
  </StyledSelect>
}
