import './util/cache'
import React from 'react'
// import ReactDOM from 'react-dom'
// import ReactDOM from 'react-dom'
import {createRoot} from 'react-dom/client'
import 'core-js/stable'
import 'regenerator-runtime/runtime' // these fix async await for babel
import 'mc_picker/dist/index'        // these fix async await for babel
import { store } from './model/store'
import { App } from './App'
import './style/main.scss'
import './i18n'
import {getCloud} from './service/cloud'

// ReactDOM.render(<App store={store} />, document.getElementById('app'))

const root = createRoot(document.getElementById('app'))
root.render(
    // todo: reinstate strictmode
    // <React.StrictMode>
      <App store={store} />
    // </React.StrictMode>
)

getCloud()

/**
 * @typedef {object} ReactElement
 * @property {Symbol} $$typeof
 * @property {object} key
 * @property {object} props
 * @property {object} ref
 * @property {object} type
 */
