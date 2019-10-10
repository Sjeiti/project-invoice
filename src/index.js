import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './model/store'
import { App } from './App'
import './style/main.scss'

ReactDOM.render(<App store={store} />, document.getElementById('app'))