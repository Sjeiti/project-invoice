/**
 * @typedef {object} session
 * @property {string} todoprops
 */

/**
 * Get session
 * @param {object} state
 * @returns {config}
 */
export const getSession = state => ({...state.session})