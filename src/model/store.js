import { createStore, applyMiddleware } from 'redux'
import {logger} from './middleWare/logger'
import {storeState} from './middleWare/storeState'
import {rootReducer} from './rootReducer'

export const store = createStore(
  rootReducer
  , applyMiddleware(logger, storeState)
)