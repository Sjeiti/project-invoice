import { STORE_CONFIG } from './actions'
import {getInitialState} from '../storage'

const initialState = getInitialState('config')

export function config(state = initialState, action){
  switch (action.type){
    case STORE_CONFIG:
      return {...state, ...action.config}

    default:
      return state
  }
}
