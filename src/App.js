import React from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import { Routes } from './Routes'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { DecryptionDialog } from './components/DecryptionDialog'
import { Notification } from './components/Notification'
import {size} from './service/css'
import {notify} from './util/signal'

const {padding, headerHeight, sum} = size

notify.add(console.log.bind(console, 'notify:'))

const Layout = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 ${padding};
  flex: 1 0 auto;
  >div {
    padding-top: ${sum(headerHeight, padding)};
    padding-bottom: ${padding};
  }
`

// export const App = hot(module)(connect(state=>({state}))(({ store }) =>
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
    </Router>
  </Provider>
))