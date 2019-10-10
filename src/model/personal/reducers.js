import {STORE_DATA} from './actions'
import {getInitialState, storeState} from '../storage'

const dataName = 'personal'
const initialState = getInitialState(dataName)
const save = storeState.bind(null, dataName)

export function personal(state = initialState, action){
  switch (action.type){
    case STORE_DATA:
      return save({...state, ...action.data})

    default:
      return state
  }
}
