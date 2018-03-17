/**
 * @typedef {object} projectLine
 * @property {number} amount
 * @property {string} description
 * @property {number} hours
 * @property {number} vat todo convert to number
 */

const proto = {}

/**
 * Create a project lien
 * @param {object} line
 * @returns {projectLine}
 */
export function create(line){
    line.vat = parseFloat(line.vat)
    return Object.setPrototypeOf(line,proto)
}
