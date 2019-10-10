import { combineReducers } from 'redux'
import { clients } from './clients/reducers'
import { config } from './config/reducers'
import { copy } from './copy/reducers'
import { personal } from './personal/reducers'
import { pi } from './pi/reducers'

export const reducers = combineReducers({
  clients
  , config
  , copy
  , personal
  , pi
})
