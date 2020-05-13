/**
 * @typedef {object} config
 * @property {string} todoprops
 */

/**
 * Get config
 * @param {object} state
 * @returns {config}
 */
export const getConfig = state => ({...state.config})