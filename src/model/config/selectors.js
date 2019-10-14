/**
 * @typedef {object} config
 * @property {string} todo
 */

/**
 * Get config
 * @param {object} state
 * @returns {config}
 */
export const getConfig = state => ({...state.config})