import styled from 'styled-components'

/**
 * A button that looks like an anchor
 */
export const AnchorButton = styled.button`
  display: inline;
  padding: 0;
  margin: 0;
  box-shadow: none;
  background-color: inherit;
  color: inherit;
  text-decoration: underline;
  transition: none;
  cursor: pointer;
  border: 0;
  font-family: inherit;
  &:hover {
    background-color: inherit;
    color: inherit;
  }
`
