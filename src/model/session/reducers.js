import {STORE_SESSION, STORE_SAVEABLE, STORE_SAVEABLEFUNCTIONS} from './actions'
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
      return {...state, ...action.session}

    case STORE_SAVEABLEFUNCTIONS:
      const [save=null, revert=null, deleet=null] = action.functions
      return {...state, ...{save, revert, deleet}}

    case STORE_SAVEABLE:
      const {saveable} = action
      return {...state, saveable}

    default:
      return state
  }
}
