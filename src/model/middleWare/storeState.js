import {STORAGE_NAME} from '../../config'
import {setStorage} from '../../service/localStorage'
import {setStorage as setStorageEncrypted} from '../../service/localStorageEncrypted'

export const storeState = store => next => action => {
  const result = next(action)
  const state = store.getState()

  // en- decrypt in service/localStorage
  // don't store password state

  if (state.config.encryption) {
    const key = state.config.encryptionKey
    delete state.config.encryptionKey // todo make separate temp/session store
    setStorageEncrypted(STORAGE_NAME, state, key)
  } else {
    setStorage(STORAGE_NAME, state)
  }

  return result
}