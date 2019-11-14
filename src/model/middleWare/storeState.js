import {STORAGE_NAME} from '../../config'
import {setStorage} from '../../service/localStorage'

export const storeState = store => next => action => {
  const result = next(action)
  const state = store.getState()
  setStorage(STORAGE_NAME, state)
  return result
}