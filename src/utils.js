import { isEqual as _isEqual } from 'lodash'

/**
 * Return a date string of format 'yyyy-mm-dd'
 * @param {string} date
 */
export function getDateString(date){
  return (date || new Date())
    .toISOString()
    .split('T')
    .shift()
}

/**
 * Facade onto lodash isEqual with option to ignore specific keys
 * @param {object} source
 * @param {object} target
 * @param {string[]} [ignoreKeys=[]]
 */
export function isEqual(source, target, ignoreKeys = []){
  const ignore = ignoreKeys.reduce((acc, key) => ((acc[key] = true), acc), {})
  return _isEqual({ ...source, ...ignore }, { ...target, ...ignore })
}

/**
 * A noop
 */
export const noop = () => {}

/**
 * Non breaking space
 */
export const nbsp = '\u00A0'

/**
 * Test if value is a function
 * @param fn
 * @return {boolean}
 */
export function isFunction(fn) {
 return fn && {}.toString.call(fn) === '[object Function]';
}

/**
 * Get the getter function that sets the key/value onto a model
 * @param {object} data
 * @param {Function} setter
 * @return {function(*=): function(*): *}
 */
export function getGetSetter(data, setter){
  const newData = {...data}
  return key => value => (
    newData[key] = value
    , setter(newData)
  )
  // return key => value =>
  //     setter({...data, ...[key, value].reduce((acc, v)=>(acc[key]=v, acc), {})})
}