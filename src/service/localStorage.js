import {parse, stringify} from './json'

const {localStorage} = window

/**
 * Get and parse localStorage content
 * @param {string} name
 * @param {boolean} [asObject=true]
 */
export function getStorage(name, asObject=true){
  const stringData = localStorage.getItem(name)
  return asObject ? parse(stringData) : stringData
}

/**
 * Set localStorage
 * @param {string} name
 * @param {object} data
 */
export function setStorage(name, data){
  let stringData = stringify(data)
  stringData && localStorage.setItem(name, stringData)
  return data
}