const {localStorage} = window

/**
 * Get and parse localStorage content
 * @param {string} name
 */
export function getStorage(name){
  const stringData = localStorage.getItem(name)
  let data
  try {
    data = JSON.parse(stringData)
  } catch (err) {
    console.error('JSON parse error', err, stringData)
  }
  return data
}

/**
 * Set localStorage
 * @param {string} name
 * @param {object} data
 */
export function setStorage(name, data){
  let stringData
  try {
    stringData = JSON.stringify(data)
  } catch (err) {
    console.error('JSON stringify error', err, data)
  }
  stringData && localStorage.setItem(name, stringData)
  return data
}
