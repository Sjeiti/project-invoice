//import { FOO } from '../actions'
import defaultModel from './default'

export function config(state = defaultModel, action){
  switch (action.type){
    //case FOO:
    //return state
    default:
      return state
  }
}
