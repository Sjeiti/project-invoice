import { STORE_SESSION } from './actions'
// import {getInitialState} from '../storage'

const initialState = {} // getInitialState('session')

export function session(state = initialState, action){
  switch (action.type){
    case STORE_SESSION:
      return {...state, ...action.session}

    default:
      return state
  }
}
