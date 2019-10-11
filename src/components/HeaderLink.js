import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components'

const StyledHeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
  ${props => props.current==='true' && css`
    background-color: #333;
    color: white;
  `}
`

export const HeaderLink = withRouter(props => {
  const { children, to, location: { pathname }} = props
  const { staticContext, ...attr } = props
  const isCurrent = to === pathname
  return <StyledHeaderLink current={isCurrent.toString()} {...attr}>{children}</StyledHeaderLink>
})