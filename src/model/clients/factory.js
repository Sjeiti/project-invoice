import { getDateString } from '../../utils'

/**
 * @typedef {object} client
 * @property {string} address
 * @property {string} city
 * @property {string} contact
 * @property {string} name
 * @property {number} nr
 * @property {number} paymentterm // todo convert to number (days)
 * @property {string} phone
 * @property {string} postbox
 * @property {project[]} projects
 * @property {string} zipcode
 * @property {string} zippost
 */

/**
 * Factory method for a new client
 * @param {number} nr
 * @returns {client}
 */
export function getClient(nr = 0){
  return {
    nr
    , name: ''
    , address: ''
    , zipcode: ''
    , postbox: ''
    , zippost: ''
    , city: ''
    , phone: ''
    , paymentterm: 21
    , contact: ''
    , projects: []
  }
}

/**
 * @typedef {object} project
 * @property {number} id
 * @property {number} clientNr
 * @property {string} description
 * @property {number} discount
 * @property {number} hourlyRate
 * @property {invoice[]} invoices
 * @property {projectLine[]} lines
 * @property {boolean} paid
 * @property {boolean} ignore
 * @property {string} quotationAfter
 * @property {string} quotationBefore
 * @property {string} quotationDate
 * @property {number} quotationDuration
 * @property {string} quotationStartDate
 */

/**
 * Factory method for a new project
 * @param {number} clientNr
 * @param {number} id
 * @returns {project}
 */
export function getProject(clientNr = 0, id = 0){
  const dateString = getDateString()
  return {
    clientNr
    , id
    , description: ''
    , hourlyRate: 0
    , discount: 0
    , lines: []
    , invoices: []
    , paid: false
    , quotationDate: dateString
    , quotationStartDate: dateString
    , quotationDuration: 7
    , quotationSubject: ''
    , quotationBefore: ''
    , quotationAfter: ''
    , ignore: false
  }
}

/**
 * @typedef {object} projectLine
 * @property {number} amount
 * @property {string} description
 * @property {number} hours
 * @property {number} vat todo convert to number
 */

/**
 * Factory method for a new project line
 * @returns {projectLine}
 */
export function getLine(){
  return {
    description: ''
    , hours: 0
    , vat: 0
    , amount: 0
  }
}

/**
 * @typedef {object} invoice
 * @property {string} date
 * @property {string} type
 * @property {boolean} interest
 * @property {boolean} exhortation todo:??
 */

/**
 * Factory method for a new project invoice
 * @returns {invoice}
 */
export function getInvoice(){
  return {
    date: getDateString()
    , type: ''
    , interest: true
  }
}
