/**
 * @typedef {object} invoice
 * @property {string} date
 * @property {boolean} interest
 * @property {string} type
 */

const proto = {
  // get fooInvoice(){return 'barInvoice'}
	get invoiceIndex(){
	  return this.project.invoices.indexOf(this.invoice)
	}
}

export function create(invoice, project){
  // create non-enumerable properties
  Object.defineProperty(invoice, 'project', { value: project, enumerable: false })
  //
  return Object.setPrototypeOf(invoice, proto);
}
