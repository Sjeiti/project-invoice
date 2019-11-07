import React from 'react'
import styled from 'styled-components'
import {StyledInput} from './Input'

// row height is 1.875rem and 0.125rem bottom margin, so three rows is 5.875rem
const StyledTextarea = styled.textarea`
  ${StyledInput.componentStyle.rules}
  height: 5.875rem;
  width: auto;
  padding: 0 0 0 0.25rem;
  
`

export const Textarea = ({ value, onChange, setter, children }) => {
  return <StyledTextarea value={value} onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})}>
    {children}
  </StyledTextarea>
}
