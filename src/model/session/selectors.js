/**
 * @typedef {object} session
 * @property {string} todo
 */

/**
 * Get session
 * @param {object} state
 * @returns {config}
 */
export const getSession = state => ({...state.session})