import React from 'react'
import ReactDOM from 'react-dom'
import 'mc_picker/dist/index'
import { store } from './model/store'
import { App } from './App'
import './style/main.scss'
import './i18n'
import {getCloud} from './service/cloud'

ReactDOM.render(<App store={store} />, document.getElementById('app'))
getCloud()

/**
 * @typedef {object} ReactElement
 * @property {Symbol} $$typeof
 * @property {object} key
 * @property {object} props
 * @property {object} ref
 * @property {object} type
 */