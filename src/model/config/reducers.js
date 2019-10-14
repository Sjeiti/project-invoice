import { STORE_CONFIG } from './actions'
import {getInitialState} from '../storage'

const dataName = 'config'
const initialState = getInitialState(dataName)

export function config(state = initialState, action){
  switch (action.type){
    case STORE_CONFIG:
      return state

    default:
      return state
  }
}
