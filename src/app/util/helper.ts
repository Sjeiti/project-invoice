/**
 * Adds a timestamp to an object
 * @param {object} o
 * @returns {any}
 */
function setTimestamp(o:any):any {
  o.timestamp = Date.now()
  return o
}

export {
  setTimestamp
}