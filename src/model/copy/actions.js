export const STORE_COPY = Symbol('STORE_COPY')
export const storeCopy = copy => ({ type: STORE_COPY, copy })
