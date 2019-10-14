import {getInitialState} from '../storage'
import {STAMP_TIME} from './actions'

const initialState = getInitialState('pi')

export function pi(state = initialState, action){
  switch (action.type){

    case STAMP_TIME:
      return state // todo

    default:
      return state
  }
}
