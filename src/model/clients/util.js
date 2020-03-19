import {stopPropagation} from '../../util'
import {INVOICE} from '../../config/invoice'
import {getInvoice} from './factory'
/**
 * Mark project as paid
 * @param {Project} project
 * @param {Function} storeProject
 * @param {MouseEvent} e
 */
export function onClickPaid(project, storeProject, e){
  storeProject(Object.assign({}, project, {  }))
  stopPropagation(e)
}

/**
 * Add reminder to project
 * @param {Project} project
 * @param {Function} storeProject
 * @param {MouseEvent} e
 */
export function onClickRemind(project, storeProject, e){
  const invoices = [...project.invoices, getInvoice(null, INVOICE.type.reminder)]
  storeProject(Object.assign({}, project, { invoices }))
}

/**
 * Add invoice to project
 * @param {Project} project
 * @param {Function} storeProject
 * @param {MouseEvent} e
 */
export function onClickInvoice(project, storeProject, e){
  storeProject(Object.assign({}, project, {
    invoices: [getInvoice()]
  }))
}
