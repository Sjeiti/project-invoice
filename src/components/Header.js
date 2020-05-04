import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, {css} from 'styled-components'
import { SaveableButtons } from './SaveableButtons'
import {Logo} from './Logo'
import {T} from './T'
import {cssVarValue} from '../service/css'
import {CloudNotification} from './CloudNotification'
import {connect} from 'react-redux'
import {getConfig} from '../model/config/selectors'
import {APP_NAME} from '../config'

const {breakpointLow, breakpointHigh} = cssVarValue
const halfHeaderHeight = `calc(0.5 * var(--header-height))` //multiply(headerHeight, 0.5)

const {body} = document

const StyledHeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
  ${props => props.current==='true' && css`
    background-color: var(--color-header-dark);
    color: white;
  `}
`
const HeaderLink = withRouter(props => {
  const { children, to, location: { pathname }} = props
  const { staticContext, ...attr } = props
  const isCurrent = to === pathname
  return <StyledHeaderLink current={isCurrent.toString()} {...attr}>{children}</StyledHeaderLink>
})

const StyledHeader = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 100vw;
  max-height: var(--header-height);
  overflow: visible;
  white-space: nowrap;
  z-index: 3;
  background: var(--color-header) linear-gradient(90deg, var(--color-header), var(--color-header-light));
  box-shadow: 0 0 16px var(--color-gray-dark);
  color: #FFF;
  
  nav:first-child { flex: 1 0 auto; }
  
  .home-icon {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    float: left;
    height: var(--header-height);
    width: var(--header-height);
    padding: 0;
    overflow: hidden;
    @media ${breakpointHigh} { position: relative; }
    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
  
  .page-title {
    position: absolute;
    left: 48px;
    top: 0;
    margin: 0;
    padding: 0;
    color: white;
    line-height: var(--header-height);
  }
  
  a { 
    font-size: 14px;
    font-weight: 600;
  }
  
  @media ${breakpointLow} {
    
    //flex-direction: row-reverse;
    justify-content: flex-end;
    
    >nav:first-child {
      flex: 0 0 2rem;
      overflow: hidden;
      order: 4;
    }
    
    nav>ul>li {
      float: right;
      //width: 100vw;
      height: var(--header-height);
      text-align: right;
      a {
        display: block;
        width: 100%;
        height: 100%;
        padding: var(--padding);
      }
    }
    [for=hamburger] {
      display: block;
      width: ${halfHeaderHeight};
      height: var(--header-height);
      padding: 1px 0;
      margin: 0;
      margin-left: calc(100vw - ${halfHeaderHeight});
      &:before, &:after, span {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        margin: 6px 0;
        background-color: white;
      }
      +ul {
        background-color: var(--color-header);
      }
    }
    #hamburger+label+ul {
      position: absolute;
      right: 0;
      height: 100vh;
      overflow: hidden;
      transform: translateX(100%);
      transition: transform 300ms ease;
      box-shadow: 0 0 0 var(--color-header);
      li {
        display: block;
      }
      a {
        padding-left: 1rem;
      }
    }
    #hamburger:checked+label+ul {
      transform: translateX(0);
      box-shadow: 0 0 16px var(--color-gray-dark);
    }
    >*:last-child {
      right: calc(${halfHeaderHeight} + var(--padding));
    }
  }
  @media ${breakpointHigh} {
    ul ul ul ${StyledHeaderLink}[current="true"] {
      box-shadow: 3rem 0 #333;
    }
    a {
      display: inline-block;
      padding: 0 16px;
      width: 100%;
      min-height: var(--header-height);
      line-height: var(--header-height);
      transition: background-color 200ms linear;
      &[current="false"] {
        background-color: transparent;
      }
      &:hover {
        background-color: var(--color-header-light);
        box-shadow: 100px 0 0 var(--color-header-light) inset;
      }
    }
  }
`

const DropLiStyled = styled.li`
  @media ${breakpointHigh} {
    position: relative;
    label {
      display: block;
      position: relative;
      z-index: 2;
      min-height: var(--header-height);
      margin: 0;
      padding: 0;
    }
    label~ul {
      z-index: 1;
    }
    ul {
      position: absolute;
      left: 0;
      top: var(--header-height);
      display: block;
      min-width: 100%;
      overflow: hidden;
      background-color: var(--color-header);
      transform: translateY(-100%);
      transition: transform 200ms linear 100ms, clip-path 200ms linear 100ms;
      clip-path: polygon(0 100%, 100% 100%, 100% 200%, 0% 200%);
    }
    &:hover ul, input:checked+ul {
      transform: translateY(0);
      clip-path: polygon(0 0, 100% 0, 100% 200%, 0% 200%);
    }
  }
`
const DropLi = ({to, title, children}) => <DropLiStyled>
  <label htmlFor={'drop'+to}><HeaderLink to={to}><T>{title}</T></HeaderLink></label>
  <input className="visually-hidden" id={'drop'+to} type="checkbox" />
  {children}
</DropLiStyled>

export const Header = withRouter(connect(
    state => ({ config: getConfig(state) })
  )(({ config, history }) => {
  const [cloudProvider] = useState(config.cloudSelected)
  const [hamburger, setHamburger] = useState(false)

  useEffect(()=>{
    const setHamburgerFalse = e=>e?.target?.matches('[for=hamburger]')||setHamburger(false)
    body.addEventListener('click', setHamburgerFalse)
    const unbind = history.listen(requestAnimationFrame.bind(null, setHamburgerFalse))
    return ()=>(unbind(), body.removeEventListener('click', setHamburgerFalse))
  }, [])

  return (
    <StyledHeader>
      <nav>
        <HeaderLink to="/" className="home-icon" style={{backgroundColor:'transparent'}}>
          {/*<Logo colors={['#3B596D','#376677','#2A7F8B']} />*/}
          {/*<Logo colors={['#1E797C','#20888B','#1E9397']} />*/}
          <Logo colors={['#1E797C', '#45BDC3', '#80D3D5']} />
          {/*<Logo />*/}
        </HeaderLink>

        <h2 className="page-title hide-high">{location.pathname==='/'?APP_NAME:location.pathname}</h2>

        <ul className="list-unstyled list-inline">
          <li>
            <input
              checked={hamburger}
              onChange={e=>setHamburger(e.target.checked)}
              className="visually-hidden"
              id="hamburger"
              type="checkbox"
            />
            <label htmlFor="hamburger"><span /></label>
            <ul onClick={() => setHamburger(!hamburger)} className="list-inline">
              <li className="hide-high"><HeaderLink to="/"><T>home</T></HeaderLink></li>
              <li><HeaderLink to="/overview"><T>overview</T></HeaderLink></li>
              <li><HeaderLink to="/clients"><T>clients</T></HeaderLink></li>
              <DropLi to="/settings" title="settings">
                <ul>
                  <li><HeaderLink to="/layout"><T>layout</T></HeaderLink></li>
                  <li><HeaderLink to="/data"><T>data</T></HeaderLink></li>
                  <li><HeaderLink to="/copy"><T>copy</T></HeaderLink></li>
                </ul>
              </DropLi>
              <li><HeaderLink to="/about"><T>about</T></HeaderLink></li>
            </ul>
          </li>
        </ul>
      </nav>
      {cloudProvider&&<CloudNotification />}
      <SaveableButtons />
    </StyledHeader>
  )
}))
