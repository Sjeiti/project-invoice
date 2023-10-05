import { STORE_SESSION, STORE_SAVEABLE, STORE_SAVE, STORE_REVERT, STORE_DELETE } from './actions'
// import {getInitialState} from '../storage'

const initialState = {
  saveable: false
  , save: null
  , revert: null
  , deleet: null
} // getInitialState('session')

export function session(state = initialState, action){
  switch (action.type){

    case STORE_SESSION:
      console.log('storingSESSION', action.session) // todo: remove log
      return {...state, ...action.session}

    case STORE_SAVEABLE:
      return {...state, ...action.saveable}

    case STORE_SAVE:
      return {...state, ...action.save}

    case STORE_REVERT:
      return {...state, ...action.revert}

    case STORE_DELETE:
      return {...state, ...action.deleet}

    default:
      return state
  }
}
