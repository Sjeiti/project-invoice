import React from 'react'
import styled from 'styled-components'
import {StyledInput} from './Input'

const StyledSelect = styled.select`
  ${StyledInput.componentStyle.rules}
  height: 1.875rem;
  padding: 0 0 0 0.25rem;
`

export const Select = ({ name, value, onChange, setter, options }) => {
  return <StyledSelect
      name={name}
      value={value}
      onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})}
  >
    {options.map(({value, text}) => <option value={value} key={value}>{text}</option>)}
  </StyledSelect>
}
