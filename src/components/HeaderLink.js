import React from 'react'
import { Link, withRouter } from 'react-router-dom'

const style = {
  a: {
    color: 'white'
    , textDecoration: 'none'
  }
  , aCurrent: {
    backgroundColor: '#333'
    , color: 'white'
  }
}

export const HeaderLink = withRouter(
  ({ children, to, className, location: { pathname } }) => (
    <Link
      to={to}
      className={className}
      style={to === pathname ? style.aCurrent : style.a}
    >
      {children}
    </Link>
  )
)
