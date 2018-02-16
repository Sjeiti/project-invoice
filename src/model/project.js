import { create as createProjectLine } from './projectLine'
import { create as createInvoice } from './invoice'
import projectSort from '../util/projectSort'

/**
 * @typedef {object} project
 * @property {number} clientNr
 * @property {string} description
 * @property {number} discount
 * @property {number} hourlyRate
 * @property {number} id
 * @property {invoice[]} invoices
 * @property {projectLine[]} lines
 * @property {boolean} paid
 * @property {string} quotationAfter
 * @property {string} quotationBefore
 * @property {string} quotationDate
 * @property {number} quotationDuration
 * @property {string} quotationStartDate
 */

const proto = {


  /**
   * @todo asdlfa;sldkf
   * @returns {{}}
   */
  get config(){
    return this.model.config
  }

  /**
   * Client name shortcut
   * @returns {string}
   */
  ,get clientName(){
    return this.client.name
  }

  /**
   * Returns an exact clone of the project
   * @returns {Project}
   */
  ,clone(){
      const cloned = JSON.parse(JSON.stringify(this))
      return create(cloned, this.client, this.model)
  },

  /**
   * Calculate the invoice number by interpolating the template
   * @returns {string}
   */
  calculateInvoiceNr() {
      // ${client.nr}.${project.indexOnClient+1}.${project.dateYear.substr(2,2)}.${project.indexOnYear+1}
      return (new Function('project','client','return `'+this.model.config.projectNumberTemplate+'`'))(this, this.client)
  },

  addLine(vat=21){
    this.lines.push({amount:0, hours:0, vat})
  },

  /**
   * A getter for the invoice number
   * @returns {string}
   */
  get invoiceNr() {
      return this.calculateInvoiceNr()
  },

  /**
   * Getter for the number of invoices
   * @returns {number}
   */
  get invoiceNum() {
      return this.invoices.length
  },

  /**
   * Getter for the total excluding VAT
   * @returns {number}
   */
  get total() {
      return this.lines.reduce((acc,line) => acc + line.amount,0)
  },

  /**
   * Getter for the total VAT amount
   * @returns {any}
   */
  get totalVat() {
      return this.lines.reduce((acc,line) => acc + line.amount * 0.01 * line.vat,0)
  },

  /**
   * Getter for the total discount excluding VAT
   * @returns {number}
   */
  get totalDiscount() {
      return this.total * 0.01 * this.discount
  },

  /**
   * Getter for the total discounted VAT
   * @returns {number}
   */
  get totalVatDiscount() {
      return this.totalVat * 0.01 * this.discount
  },

  /**
   * Getter for the total minus discount excluding VAT
   * @returns {number}
   */
  get totalDiscounted() {
      return this.total - this.totalDiscount
  },

  /**
   * Getter for the total discounted VAT
   * @returns {number}
   */
  get totalVatDiscounted() {
      return this.totalVat - this.totalVatDiscount
  },

  /**
   * Getter for the discounted total including VAT
   * @returns {number}
   */
  get totalIncDiscounted() {
      return this.totalDiscounted + this.totalVatDiscounted
  },

  /**
   * Getter for the discounted total with interest excluding VAT
   * @returns {number}
   */
  get totalIncDiscountedInterest() {
      return this.totalIncDiscounted + this.interest
  },

  /**
   * Getter for the total interest
   * @returns {number}
   */
  get interest() {
    return (this.daysLate/365)*(0.01*this.model.personal.interestAmount)*this.total
  },

  /**
   * Getter for number of days late
   * @returns {number}
   */
  get daysLate() {
    let today = new Date,
      diffMillis = today.getTime()-this.date.getTime(),
      day = 1000*60*60*24
    return diffMillis/day<<0
  },

  /**
   * Getter for the date
   * @returns {Date}
   */
  get date(){
      return this.invoices.length!==0?new Date(this.invoices[0].date):new Date()
  },

  /**
   * Getter for the latest invoice date
   * @returns {number}
   */
  get dateLatest(){
    let latestDate = new Date(this.quotationDate)
    this.invoices.forEach(invoice=> {
      let invoiceDate = new Date(invoice.date)
      if (invoiceDate>latestDate) {
        latestDate = invoiceDate
      }
    })
    return latestDate
  },

  /**
   * Calculate hourly rate by minimum and maximum
   * @returns {number}
   */
  get hourlyRateCalculated() {
    const {hourrateMin, hourrateMax, hoursMin, hoursMax} = this.model.personal
    const {totalHours} = this
    let hourlyRate = hourrateMax
    if (totalHours>=hoursMax) {
      hourlyRate = hourrateMin
    } else if (totalHours>hoursMin) {
      const asdf = (totalHours - hoursMin)/(hoursMax - hoursMin)
      hourlyRate = hourrateMax - asdf*(hourrateMax - hourrateMin)
    }
    return hourlyRate
  },

  /**
   * Getter for the discounted hourly rate
   * @returns {number}
   */
  get hourlyRateDiscounted() {
    return this.hourlyRate - 0.01*this.discount*this.hourlyRate
  },

  /**
   * Getter for the total hours
   * @returns {number}
   */
  get totalHours() {
    return this.lines.reduce((acc, line)=>acc+line.hours,0)
  },

  /**
   * Returns the project index in client.projects
   * @returns {number}
   */
  get indexOnClient() {
    let index = -1
    this.client.projects
        .slice(0)
        .sort(projectSort)
        .forEach((p,i)=>{
          if (p.id===this.id) index = i
        })
    return index
    // return this.client.projects
    //     .slice(0)
    //     // .filter(project=>project.invoices.length>0)
    //     .sort(projectSort)
    //     .indexOf(this)
  },

  /**
   * Getter for project date year
   * @returns {number}
   */
  get year() {
      return this.date.getFullYear()
  },

  /**
   * Getter for project date year as string
   * @returns {string}
   */
  get dateYear() {
      return this.year.toString()
  },

  /**
   * Returns the project index in that project years projects
   * @returns {number}
   */
  get indexOnYear() {
    let year = this.year,
        projectsInYear = this.model.projects
            .filter(project=>project.invoices.length>0&&project.year===year)
            .sort(projectSort)
            .map(project=>project.id)

    return projectsInYear.indexOf(this.id)
  },

  //////////////////////////////////////////////////

  /**
   * Getter for the timestamp of the project
   * @returns {number}
   */
  get timestamp(){
    return this.date.getTime()
  },

  /**
   * Getter for the timestamp of the latest project date
   * @returns {number}
   */
  get timestampLatest(){
    return this.dateLatest.getTime()
  },

  // /**
  //  * Getter for project date year
  //  * @returns {number}
  //  */
  // get year(){
  //   return this.date.getFullYear()
  // },

  /**
   * Getter for project date quarter
   * @returns {number}
   */
  get quarter(){
    return ((this.date.getMonth()+1)/4)<<0+1
  },

  // /**
  //  * Getter for project date year as a string
  //  * @returns {string}
  //  */
  // get dateYear(){
  //   return this.year.toString()
  // },

  /**
   * Getter for the formatted project date
   * @returns {string}
   */
  get dateFormatted(){
    const dateFormat = this.copy.dateFormat[this.model.config.lang]
    return this.datePipe.transform(this.date, dateFormat)
  },

  /**
   * Getter for the url of the project
   * @returns {string}
   */
  get uri(){
    return `/client/${this.clientNr}/${this.indexOnClient}`
  },

  /**
   * Getter for the project client
   * @returns {client}
   */
  get client(){
    return this._client
  },

  /**
   * Getter boolean if the project payment is overdue
   * @returns {boolean}
   */
  get overdue(){
    const dateDiff = +new Date() - +this.dateLatest
    const dateDiffDays = dateDiff/(1000*60*60*24)
    return dateDiffDays>this.client.paymentterm
    // return dateDiffDays>this.data.personal.reminderPeriod // todo:
  }
  //////////////////////////////////////////////////

}

export function create(project, client, model){
    //
    // create model getter on prototype once
    !proto.hasOwnProperty('model') && Object.defineProperty(proto, 'model', { get: function(){return model} })
    //
    // create non-enumerable properties
    Object.defineProperty(project, 'client', { value: client, enumerable: false })
    //
    // create project lines
    project.lines.forEach((line,i,a)=>(a[i] = createProjectLine(line)))
    //
    // create project invoices
    project.invoices.forEach((invoice,i,a)=>(a[i] = createInvoice(invoice,project)))
    //
    // project.quotationDate = new Date(project.quotationDate)
    // project.quotationStartDate = new Date(project.quotationStartDate)
    //
    return Object.setPrototypeOf(project, proto);
}
