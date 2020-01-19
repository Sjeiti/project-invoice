import {getStorage} from '../service/localStorage'
import {isEncrypted} from '../service/encryption'
import {getStorage as getStorageEncrypted} from '../service/localStorageEncrypted'
import {data as defaultData} from './default'
import {STORAGE_NAME} from '../config'

const stringData = localStorage.getItem(STORAGE_NAME)
const dataIsEncrypted = isEncrypted(stringData)
const key = dataIsEncrypted && prompt('password') || null
const data = dataIsEncrypted
  && getStorageEncrypted(STORAGE_NAME, key)
  || getStorage(STORAGE_NAME) || defaultData

if (data&&key) data.config.encryptionKey = key


/**
 * Get the initial state for a data property
 * This is either from localStorage or a default model
 * @param {string} key
 * @return {object}
 */
export function getInitialState(key){
  return key&&data?.[key]||data
}