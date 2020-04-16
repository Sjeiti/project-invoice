import {combineReducers} from 'redux'
import { clients } from './clients/reducers'
import { config } from './config/reducers'
import { copy } from './copy/reducers'
import { personal } from './personal/reducers'
import { session } from './session/reducers'
import {LOAD_STORE, RESTORE_STORE} from './rootActions'
import {getInitialState} from './storage'
import {validateExternalStore} from './validate'

const appReducer = combineReducers({
  timestamp: (state = getInitialState('timestamp')) => state
  , version: (state = getInitialState('version')) => state
  , clients
  , config
  , copy
  , personal
  , session
})
export const rootReducer = (state, action) => {
  if (action.type === RESTORE_STORE) {
    state = validateExternalStore(action.newState)
  }
  if (action.type === LOAD_STORE) {
    state = action.newState
  }
  return appReducer(state, action)
}