import React from 'react'
import styled from 'styled-components'
import {formElement} from '../service/css'
import {Icon} from './Icon'

export const Button = styled.button`
  ${formElement}
  box-shadow: inset 0 0 0 1px #19759e, inset 1px 1px 0 1px #1f8fc1,
    inset 0 -2px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--color-button);
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s linear;
  cursor: pointer;
  &:hover {
    background-color: var(--color-buttonL05);
  }
  &:focus {
    box-shadow: 0 0 0 1px var(--color-buttonD10) inset,
      1px 1px 0 1px var(--color-buttonL40) inset,
      0 -2px 8px var(--color-shade) inset,
      var(--shade-flat);
  }
  &[disabled], &[disabled]:hover {
    opacity: 0.3;
    background-color: var(--color-button);
    cursor: default;
  }
  ${props => props.invert?`
    background-color: transparent;
    color: #666;
    box-shadow: none;
    &:hover, &:focus {
      box-shadow: none;
      background-color: transparent;
      color: var(--color-button)
    }
    &[disabled], &[disabled]:hover, &[disabled]:focus {
      background-color: transparent;
    }
  `:''}
`

// height should be 2*0.5rem padding + 0.875rem fontsize
const StyledIconButton = styled(Button)`
  width: 1.875rem;
  height: 1.875rem;
  padding: 0;
  font-size: 1rem;
  line-height: 1.875rem;
  overflow: hidden;
  text-align: center;
`

export const IconButton = ({type, ...props}) => <StyledIconButton {...props}><Icon type={type} /></StyledIconButton>