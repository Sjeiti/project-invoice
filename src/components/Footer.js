import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {VERSION} from '../config'
import {T} from './T'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  margin: 40px 0 0;
  padding: 4px 8px;
  font-size: 10px;
  text-align: center;
  background-color: var(--color-headerD10);
  box-shadow: 0 1px 0 1px var(--color-headerD10);
  color: var(--color-header-foreground);
  a {
    color: inherit;
    text-decoration: none;
  }
  .icon-github {
    padding-left: 4px;
    display: inline-block;
    transform: translateY(3px);
  }
`

const Love = styled.span`
  display: inline-block;
  padding-left: 2px;
  color: var(--color-red);
  animation-duration: 861ms;
  animation-name: heartbeat;
  animation-iteration-count: infinite;
  @keyframes heartbeat {
    from { transform: scale(1); }
    to { transform: scale(1.4); }
  }
`

export const Footer = attr => <StyledFooter {...attr}>
  <a href="https://ronvalstar.nl/"><T>made with</T> <Love>&#9829;</Love></a>
  <Link to="/changelog">Project Invoice v{VERSION}</Link>
  <a href="https://github.com/Sjeiti/project-invoice"><T>fork on</T> &nbsp;<span className="icon-github"></span></a>
</StyledFooter>

