import React from 'react'
import { Provider, connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { hot } from 'react-hot-loader'
import { Routes } from './Routes'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

export const App = hot(module)(connect()(({ store }) => (
  <Provider store={store}>
    <Router>
      <Header />
      <div className="layout">
        <div>
          <Routes />
        </div>
      </div>
      <Footer />
    </Router>
  </Provider>
)))