import CryptoJS from 'crypto-js'
import {tryParse} from '../util'

/**
 * Test if supposed JSON string is an encryption by regex char check.
 * @param {string} string
 * @returns {boolean}
 */
export function isEncrypted(string){
  return !!(string && string.match(/^[\w+/=]+$/))
}

/**
 * Decrypt to JSON string
 * @param {string} hash
 * @param {string} key
 * @returns {string}
 */
export function decrypt(hash, key){
  let rawData
  try {
    rawData = CryptoJS.AES.decrypt(hash, key).toString(CryptoJS.enc.Utf8)
  } catch (err){
    // console.warn('err',err)
  }
  return rawData
}

/**
 * Encrypt
 * @param {string} string
 * @param {string} key
 * @returns {string}
 */
export function encrypt(string, key){
  return CryptoJS.AES.encrypt(string, key).toString()
}

/**
 * Decrypt and parse JSON string to object
 * @param {string} hash
 * @param {string} key
 * @returns {Object}
 */
export function decryptObject(hash, key){
  return tryParse(decrypt(hash, key))
}

/**
 * Stringify object and encrypt
 * @param {object} obj
 * @param {string} key
 * @returns {string}
 */
export function encryptObject(obj, key){
  return encrypt(JSON.stringify(obj), key)
}