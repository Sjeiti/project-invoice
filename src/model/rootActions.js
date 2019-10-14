export const RESTORE_STORE = Symbol('RESTORE_STORE')
export const restoreState = newState => ({ type: RESTORE_STORE, newState })

