/**
 * Non-blocking JSON parse
 * @param {string} stringData
 * @return {object}
 */
export function parse(stringData){
  let data
  try {
    data = JSON.parse(stringData)
  } catch (err) {
    console.error('JSON parse error', err, stringData)
  }
  return data
}
/**
 * Non-blocking JSON stringify
 * @param {object} obj
 * @return {string}
 */
export function stringify(obj){
  let stringData
  try {
    stringData = typeof obj === 'string' ? obj : JSON.stringify(obj)
  } catch (err) {
    console.error('JSON stringify error', err, obj)
  }
  return stringData
}