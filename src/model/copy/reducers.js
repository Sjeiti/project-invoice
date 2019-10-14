import {getInitialState} from '../storage'

const initialState = getInitialState('copy')

export function copy(state = initialState, action){
  switch (action.type){
    //case FOO:
    //return state
    default:
      return state
  }
}
