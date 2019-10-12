import styled from 'styled-components'
import { lighten, darken } from 'polished'
import {color} from '../cssService'

const {
  colorButton
  , colorShade
  , shadeFlat
} = color

export const Button = styled.button`
  display: inline-block;
  margin: 0 0 8px 4px;
  padding: 8px 14px;
  box-shadow: inset 0 0 0 1px #19759e, inset 1px 1px 0 1px #1f8fc1,
    inset 0 -2px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colorButton};
  border: 0;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1rem;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.2s linear;
  cursor: pointer;
  &:hover {
    background-color: ${lighten(0.05, colorButton)};
  }
  &:focus {
    box-shadow: 0 0 0 1px ${darken(0.1, colorButton)} inset,
      1px 1px 0 1px ${lighten(0.2, colorButton)} inset,
      0 -2px 8px ${colorShade} inset,
      ${shadeFlat};
  }
  &[disabled], &[disabled]:hover {
    opacity: 0.3;
    background-color: ${colorButton};
  }
`
