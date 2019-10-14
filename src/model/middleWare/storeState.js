import {STORAGE_NAME} from '../../config'
import {setStorage} from '../../localStorageService'

export const storeState = store => next => action => {
  const result = next(action)
  setStorage(STORAGE_NAME, store.getState())
  return result
}