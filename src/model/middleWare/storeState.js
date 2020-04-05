import {NOOP_ACTIONS, STORAGE_NAME, VERSION} from '../../config'
import {setStorage} from '../../service/localStorage'
import {setStorage as setStorageEncrypted} from '../../service/localStorageEncrypted'
import {cloneDeep} from 'lodash'

export const storeState = store => next => action => {
  const result = next(action)
  if (!NOOP_ACTIONS.includes(action.type)) {
    const state = cloneDeep(store.getState())
    const {session:{encryptionKey}} = state
    delete state.session
    state.version = VERSION
    state.timestamp = Date.now()
    if (state.config.encryption&&encryptionKey) {
      setStorageEncrypted(STORAGE_NAME, state, encryptionKey)
    } else {
      setStorage(STORAGE_NAME, state)
    }
  }
  return result
}
