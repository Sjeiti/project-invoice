import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './model/store'
import { App } from './App'
import './style/main.scss'
import './i18n'

ReactDOM.render(<App store={store} />, document.getElementById('app'))

/**
 * @typedef {object} ReactElement
 * @property {Symbol} $$typeof
 * @property {object} key
 * @property {object} props
 * @property {object} ref
 * @property {object} type
 */