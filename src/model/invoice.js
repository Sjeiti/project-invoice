/**
 * @typedef {object} invoice
 * @property {string} date
 * @property {boolean} interest
 * @property {string} type
 */

const proto = {
  get fooInvoice(){return 'barInvoice'}
}

export function create(invoice){
    return Object.setPrototypeOf(invoice, proto);
}
