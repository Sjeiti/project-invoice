import {getStorage, setStorage} from '../localStorageService'
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
  return data?.[key]
}

/**
 * Store data properties to localStorage
 * @param {string} key
 * @param {object} subData
 * @return {object}
 * @todo maybe refactor to higher order factory
 */
export function storeState(key, subData){
  data[key] = subData
  setStorage(STORAGE_NAME, data)
  return subData
}