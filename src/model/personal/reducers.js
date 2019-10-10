import defaultModel from './default'
import {STORE_DATA} from './actions'

export function personal(state = defaultModel, action){
  switch (action.type){
    case STORE_DATA:
      return {...state, ...action.data}

    default:
      return state
  }
}
