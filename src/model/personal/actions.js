export const STORE_DATA = Symbol('STORE_DATA')
export const storeData = data => ({ type: STORE_DATA, data })
