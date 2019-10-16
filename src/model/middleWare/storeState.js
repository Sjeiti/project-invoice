import {STORAGE_NAME} from '../../config'
import {setStorage} from '../../localStorageService'

export const storeState = store => next => action => {
  const result = next(action)
  const state = store.getState()
  setStorage(STORAGE_NAME, state)
  return result
}