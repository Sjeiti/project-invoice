/**
 * @typedef {object} copy
 * @property {number} index
 * @property {string} nl
 * @property {string} en
 */

const proto = {
  get fooCopy(){return 'barCopy'}
}

export function create(copy){
    return Object.setPrototypeOf(copy, proto);
}
