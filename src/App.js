import React from 'react'
import {Provider, connect} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {hot} from 'react-hot-loader'
import styled from 'styled-components'
import {Routes} from './Routes'
import {Header} from './components/Header'
import {Footer} from './components/Footer'
import {DecryptionDialog} from './components/DecryptionDialog'
import {Notification} from './components/Notification'
import {notify} from './util/signal'
import {tableGlobalStyle} from './components/tableGlobalStyle'
import {ColorScheme} from './components/ColorScheme'
import {MODE_DEVELOPMENT} from './config'

MODE_DEVELOPMENT&&notify.add(console.log.bind(console, 'Notify:'))

const Layout = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--padding);
  flex: 1 0 auto;
  >div {
    padding-top: calc(var(--header-height) + var(--padding));
    padding-bottom: var(--padding);
  }
  ${tableGlobalStyle}
`

export const App = hot(module)(connect()(({ store }) =>
  <Provider store={store}>
    <Router>
      <Header />
      <Layout>
        <Notification />
        <div>
          <Routes />
        </div>
      </Layout>
      <Footer />
      <DecryptionDialog />
      <ColorScheme />
    </Router>
  </Provider>
))
