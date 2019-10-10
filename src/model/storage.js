import {getStorage, setStorage} from '../localStorageService'
import {data as defaultData} from './default'

const data = getStorage('pi') || defaultData

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
 */
export function storeState(key, subData){
  data[key] = subData
  setStorage('pi', data)
  return subData
}