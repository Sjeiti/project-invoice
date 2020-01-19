import {getStorage as _getStorage, setStorage as _setStorage} from './localStorage'
import {encrypt, decrypt} from './encryption'
import {stringify, parse} from './json'

/**
 * Get and parse localStorage content
 * @param {string} name
 * @param {string} key
 */
export function getStorage(name, key){
  const encryptedData = _getStorage(name, false)
  const decryptedData = decrypt(encryptedData, key)
  return parse(decryptedData)
}

/**
 * Set localStorage
 * @param {string} name
 * @param {object} data
 * @param {string} key
 */
export function setStorage(name, data, key){
  const encryptedData = encrypt(stringify(data), key)
  _setStorage(name, encryptedData)
  return data
}
