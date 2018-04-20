/**
 * @typedef {object} invoice
 * @property {string} date
 * @property {string} type
 * @property {boolean} interest
 * @property {boolean} exhortation todo:??
 */

const proto = {

  /**
   * Returns an exact clone of the project
   * @returns {Project}
   */
  clone(){
    const cloned = JSON.parse(JSON.stringify(this))
    return create(cloned,this.project)
  }

  /**
   * Get the index of the invoice
   * @returns {number}
   */
  ,get invoiceIndex(){
    return this.project.invoices.indexOf(this)
  }

  /**
   * Get the total for this invoice
   * @returns {number}
   */
  ,get total(){
    return this.interest
        ?this.project.totalIncDiscountedInterest
        :this.project.totalIncDiscounted
  }

  /**
   * Get the cumulative of current invoice.paid plus the previous ones
   * @returns {number}
   */
  ,get alreadyPaid(){
    return (this.project.invoices||[])
        .slice(0,this.invoiceIndex+1)
        .map(invoice=>parseFloat(invoice.paid||0))
        .reduce((a,b)=>a+b,0)
  }

  /**
   * Get the remaining due amount
   * @returns {number}
   */
  ,get remainder(){
    return this.total-this.alreadyPaid
  }
}

/**
 * Create an invoice
 * @param {object} invoice
 * @param {project} project
 * @returns {invoice}
 */
export function create(invoice,project){
  // create non-enumerable properties
  Object.defineProperty(invoice,'project',{ value: project,enumerable: false })
  //
  return Object.setPrototypeOf(invoice,proto)
}
