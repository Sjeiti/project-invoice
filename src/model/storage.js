import {getStorage} from '../localStorageService'
import {data as defaultData} from './default'
import {STORAGE_NAME} from '../config'

const data = getStorage(STORAGE_NAME) || defaultData

/**
 * Get the initial state for a data property
 * This is either from localStorage or a default model
 * @param {string} key
 * @return {object}
 */
export function getInitialState(key){
  return key&&data?.[key]||data
}