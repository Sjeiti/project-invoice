import {STORE_DATA} from './actions'
import {getInitialState} from '../storage'

const dataName = 'personal'
const initialState = getInitialState(dataName)

export function personal(state = initialState, action){
  switch (action.type){
    case STORE_DATA:
      return {...state, ...action.data}

    default:
      return state
  }
}
