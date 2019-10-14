import {combineReducers} from 'redux'
import { clients } from './clients/reducers'
import { config } from './config/reducers'
import { copy } from './copy/reducers'
import { personal } from './personal/reducers'
import { pi } from './pi/reducers'
import {RESTORE_STORE} from './rootActions'

const appReducer = combineReducers({
  clients
  , config
  , copy
  , personal
  , pi
})

export const rootReducer = (state, action) => {
  if (action.type === RESTORE_STORE) {
    state = action.newState
  }
  return appReducer(state, action)
}