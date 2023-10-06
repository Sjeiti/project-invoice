export const STORE_SESSION = Symbol('STORE_SESSION')
export const STORE_SAVEABLEFUNCTIONS = Symbol('STORE_SAVEABLEFUNCTIONS')
export const STORE_SAVEABLE = Symbol('STORE_SAVEABLE')

export const storeSession = session => ({ type: STORE_SESSION, session })
export const storeSaveableFunctions = (...functions) => ({ type: STORE_SAVEABLEFUNCTIONS, functions })
export const storeSaveable = saveable => ({ type: STORE_SAVEABLE, saveable })

