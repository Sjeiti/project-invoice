import {deepFreeze} from '../../utils'

export const freeze = store => next => action => {
  deepFreeze(store.getState())
  return next(action)
}