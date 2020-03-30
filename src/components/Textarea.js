import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {StyledInput} from './Input'

// row height is 1.875rem and 0.125rem bottom margin, so three rows is 5.875rem
const StyledTextarea = styled.textarea`
  ${StyledInput.componentStyle.rules}
  min-height: 5.875rem;
  width: auto;
  //padding: 0 0 0 0.25rem;
  padding: 0.5rem 0.75rem;
  line-height: 140%;
`

export const Textarea = forwardRef(({value, onChange, setter, children, ...attr}, ref) => {
  return <StyledTextarea
      rows={1}
      ref={ref}
      value={value}
      {...attr}
      onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})}>
    {children}
  </StyledTextarea>
})
