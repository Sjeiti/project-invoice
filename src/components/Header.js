import React, { useState } from 'react'
import { HeaderLink } from '../components/HeaderLink'
import './header.scss'
import { SaveableButtons } from './SaveableButtons'
import {Logo} from './Logo'

export const Header = () => {
  const [hamburger, setHamburger] = useState(false)
  return (
    <header>
      <nav>
        <HeaderLink to="/" className="home-icon">
          <Logo/>
        </HeaderLink>
        <h2 className="page-title hide-high">pageTitle</h2>
        <ul className="list-unstyled list-inline">
          <li>
            <input
              defaultChecked={hamburger}
              className="visually-hidden"
              id="hamburger"
              type="checkbox"
            />
            <label htmlFor="hamburger">
              <span />
            </label>
            <ul onClick={() => setHamburger(!hamburger)} className="list-inline">
              <li className="hide-high">
                <HeaderLink to="/">home</HeaderLink>
              </li>
              <li className="drop">
                <label htmlFor="drop1">
                  <HeaderLink to="/overview">overview</HeaderLink>
                </label>
                <input className="visually-hidden" id="drop1" type="checkbox" />
                <ul>
                  <li>
                    <HeaderLink to="/overview/quarter">quarter</HeaderLink>
                  </li>
                </ul>
              </li>
              <li>
                <HeaderLink to="/clients">clients</HeaderLink>
              </li>
              <li className="drop">
                <label htmlFor="drop2">
                  <HeaderLink to="/settings">settings</HeaderLink>
                </label>
                <input className="visually-hidden" id="drop2" type="checkbox" />
                <ul>
                  <li>
                    <HeaderLink to="/layout">layout</HeaderLink>
                  </li>
                  <li>
                    <HeaderLink to="/data">data</HeaderLink>
                  </li>
                  <li>
                    <HeaderLink to="/copy">copy</HeaderLink>
                  </li>
                </ul>
              </li>
              <li>
                <HeaderLink to="/about">about</HeaderLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <SaveableButtons />
    </header>
  )
}
