export const STORE_SESSION = Symbol('STORE_SESSION')
export const storeSession = session => ({ type: STORE_SESSION, session })

