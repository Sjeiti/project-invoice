export const RESTORE_STORE = Symbol('RESTORE_STORE')
export const LOAD_STORE = Symbol('LOAD_STORE')
export const restoreState = newState => ({ type: RESTORE_STORE, newState })
export const loadState = newState => ({ type: LOAD_STORE, newState })

