/**
 * @typedef {object} copy
 * @property {number} index
 * @property {string} nl
 * @property {string} en
 */

const proto = {
  toString(){
    return this[this.lang]
  }
}

/**
 * Create a copy model
 * @param {object} copy
 * @param {config} config
 * @returns {copy}
 */
export function create(copy,config){
  !proto.hasOwnProperty('lang') && Object.defineProperty(proto,'lang',{ get: function(){
return config.lang
} })
  return Object.setPrototypeOf(copy,proto)
}
