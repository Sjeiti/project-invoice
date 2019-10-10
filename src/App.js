import React from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { Header } from './components/Header'
import { Routes } from './Routes'
import { hot } from 'react-hot-loader'

const Appp = connect()(({ store }) => (
  <Provider store={store}>
    <Router>
      <Header />
      <div className="layout">
        <div>
          <Routes />
        </div>
      </div>
    </Router>
  </Provider>
))

export const App = hot(module)(Appp);