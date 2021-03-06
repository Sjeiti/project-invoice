import { createStore, applyMiddleware } from 'redux'
import {logger} from './middleWare/logger'
import {storeState} from './middleWare/storeState'
import {storeCloud} from './middleWare/storeCloud'
import {freeze} from './middleWare/freeze'
import {rootReducer} from './rootReducer'
import {MODE_DEVELOPMENT} from '../config'

const middleware = [storeState, storeCloud]
MODE_DEVELOPMENT && middleware.push(logger, freeze)

/**
 * The store
 * @type {Store<any, Action> & {dispatch: any}}
 */
export const store = createStore(
  rootReducer
  , applyMiddleware(...middleware)
)