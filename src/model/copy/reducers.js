import {STORE_COPY} from './actions'
import {getInitialState} from '../storage'

const initialState = getInitialState('copy')

export function copy(state = initialState, action){
  switch (action.type){
    case STORE_COPY:
      return action.copy

    default:
      return state
  }
}
