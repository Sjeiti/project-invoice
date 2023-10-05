export const STORE_SESSION = Symbol('STORE_SESSION')
export const STORE_SAVEABLE = Symbol('STORE_SAVEABLE')
export const STORE_SAVE = Symbol('STORE_SAVE')
export const STORE_REVERT = Symbol('STORE_REVERT')
export const STORE_DELETE = Symbol('STORE_DELETE')

export const storeSession = session => ({ type: STORE_SESSION, session })
export const storeSaveable = saveable => ({ type: STORE_SAVEABLE, saveable })
export const storeSave = save => ({ type: STORE_SAVE, save })
export const storeRevert = revert => ({ type: STORE_REVERT, revert })
export const storeDelete = deleet => ({ type: STORE_DELETE, deleet })

