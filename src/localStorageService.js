

/**
 * Get and parse localStorage content
 * @param {string} name
 * @todo clean and move to service/facade/whatever
 */
export function getStorage(name){
  const stringData = window.localStorage.getItem(name)
  return stringData && JSON.parse(stringData)
}

/**
 * Set localStorage
 * @param {string} name
 * @param {object} data
 * @todo clean and move to service/facade/whatever
 */
export function setStorage(name, data){
  data && window.localStorage.setItem(name, JSON.stringify(data))
  return data
}
