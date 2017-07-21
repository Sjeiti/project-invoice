import {DatePipe} from '@angular/common'
import {IProject} from '../interface/project'
import {IInvoice} from '../interface/invoice'
import {IInvoiceLine} from '../interface/invoice-line'
import {ModelService} from './model.service'
import {Client} from './client'
import {dontEnumerateAccessors} from '../mixins'
import {projectSort} from '../util/project'
import {IData} from '../interface/store-data'

/**
 * Project class
 */
export class Project implements IProject {

  id = 0
  clientNr:number = -1
  description = ''
  discount = 0
  hourlyRate = 80
  // invoiceNr = ''
  invoices:IInvoice[] = []
  lines:IInvoiceLine[] = []
  paid = false
  quotationAfter = ''
  quotationBefore = ''
  quotationDate = ''
  quotationStartDate = ''
  quotationDuration = 1
  private personal:any
  private copy:any
  private data:IData
  private config:any
  private datePipe:DatePipe
  private _client:Client

  private startValue:any[] = [0]

  /**
   * Project constructor
   * Since projects are saved by JSON.stringify all accessors are set to non-enumerable.
   * Not enumerating certain private variables does not work due to interpolation and Zone errors.
   * So we're still forced to delete some properties on save (@see ModelService::saveData).
   * @param {IProject} model
   * @param {Client} forClient
   * @param {ModelService} modelService
   */
  constructor(
      model:IProject,
      forClient:Client,
      public modelService:ModelService
  ) {
    Object.defineProperty(this, 'copy', { enumerable:false, value:this.modelService.getCopy() })
    Object.defineProperty(this, 'config', { enumerable:false, value:this.modelService.getConfig() })
    Object.defineProperty(this, 'data', { enumerable:false, value:this.modelService.getData() })
    // cannot do this for modelService, personal and _client
    dontEnumerateAccessors(this)
    //
    for (let name in model) {
      if (model.hasOwnProperty(name)) {
        this[name] = model[name]
      }
    }
    this.datePipe = new DatePipe('en')
    this.personal = this.modelService.getPersonal()
    this._client = forClient
  }

  /**
   * Returns an exact clone of the project
   * @returns {Project}
   */
  clone(){
    return new Project(this, this.client, this.modelService)
  }

  /**
   * Calculate the invoice number by interpolating the template
   * @returns {string}
   */
  private calculateInvoiceNr():string {
    const projectNumberTemplate = (<any>this.modelService.getConfig()).projectNumberTemplate,
        model = {project: this, client: this.client}
    return this.modelService.getInterpolationService().parse(projectNumberTemplate, model)
  }

  /**
   * A getter for the invoice number
   * @returns {string}
   */
  get invoiceNr():string {
    return this.calculateInvoiceNr()
  }

  /**
   * Getter for the number of invoices
   * @returns {number}
   */
  get invoiceNum():number {
    return this.invoices.length
  }

  /**
   * Getter for the total excluding VAT
   * @returns {any}
   */
  get total():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.amount)
  }

  /**
   * Getter for the total including VAT
   * @returns {any}
   */
  get totalVat():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.amount*0.01*line.vat)
  }

  /**
   * Getter for the total discount excluding VAT
   * @returns {number}
   */
  get totalDiscount():number {
    return this.total*0.01*this.discount
  }

  /**
   * Getter for the total discounted VAT
   * @returns {number}
   */
  get totalVatDiscount():number {
    return this.totalVat*0.01*this.discount
  }

  /**
   * Getter for the total minus discount excluding VAT
   * @returns {number}
   */
  get totalDiscounted():number {
    return this.total-this.totalDiscount
  }

  /**
   * Getter for the total discounted VAT
   * @returns {number}
   */
  get totalVatDiscounted():number {
    return this.totalVat-this.totalVatDiscount
  }

  /**
   * Getter for the discounted total including VAT
   * @returns {number}
   */
  get totalIncDiscounted():number {
    return this.totalDiscounted+this.totalVatDiscounted
  }

  /**
   * Getter for the discounted total with interest excluding VAT
   * @returns {number}
   */
  get totalIncDiscountedInterest():number {
    return this.totalIncDiscounted + this.interest
  }

  /**
   * Getter for the total interest
   * @returns {number}
   */
  get interest():number{
    return (this.daysLate/365)*(0.01*this.personal.interestAmount)*this.total
  }

  /**
   * Getter for number of days late
   * @returns {number}
   */
  get daysLate():number{
    let today = new Date,
      diffMillis = today.getTime()-this.date.getTime(),
      day = 1000*60*60*24
    return diffMillis/day<<0
  }

  /**
   * Getter for the date
   * @returns {number}
   */
  get date():Date{
    return this.invoices.length!==0?new Date(this.invoices[0].date):new Date()
  }


  /**
   * Getter for the latest invoice date
   * @returns {number}
   */
  get dateLatest():Date{
    let latestDate:Date = new Date(this.quotationDate)
    this.invoices.forEach(invoice=> {
      let invoiceDate:Date = new Date(invoice.date)
      if (invoiceDate>latestDate) {
        latestDate = invoiceDate
      }
    })
    return latestDate
  }

  /**
   * Calculate hourly rate by minimum and maximum
   * @returns {number}
   */
  get hourlyRateCalculated():number {
    const {hourrateMin, hourrateMax, hoursMin, hoursMax} = this.personal
    const {totalHours} = this
    let hourlyRate = hourrateMax
    if (totalHours>=hoursMax) {
      hourlyRate = hourrateMin
    } else if (totalHours>hoursMin) {
      const asdf = (totalHours - hoursMin)/(hoursMax - hoursMin)
      hourlyRate = hourrateMax - asdf*(hourrateMax - hourrateMin)
    }
    return hourlyRate
  }

  /**
   * Getter for the discounted hourly rate
   * @returns {number}
   */
  get hourlyRateDiscounted():number {
    return this.hourlyRate - 0.01*this.discount*this.hourlyRate
  }

  /**
   * Getter for the total hours
   * @returns {number}
   */
  get totalHours():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.hours)
  }

  /**
   * Getter for the index of the project on the client.projects by checking the id
   * @returns {number}
   */
  get indexOnClient():number {
    const client = this.client,
        projects = client&&client.sortProjects()||[]
    let index = -1
    projects.forEach((project, i)=>{
      // project could be a clone so client.projects.indexOf wouldn't work
      if (this.id===(project as Project).id) {
        index = i
      }
    })
    return index
  }

  /**
   * Getter for project index on current year of all projects
   * @returns {number}
   */
  get indexOnYear():number {
    let year = this.year,
        projectsInYear = this.modelService.getProjects()
            .filter(project=>project.invoices.length>0&&project.year===year)
            .sort(projectSort)
            .map(project=>project.id)
    return projectsInYear.indexOf(this.id)
  }

  /**
   * Getter for the timestamp of the project
   * @returns {number}
   */
  get timestamp():number {
    return this.date.getTime()
  }

  /**
   * Getter for the timestamp of the latest project date
   * @returns {number}
   */
  get timestampLatest():number {
    return this.dateLatest.getTime()
  }

  /**
   * Getter for project date year
   * @returns {number}
   */
  get year():number {
    return this.date.getFullYear()
  }

  /**
   * Getter for project date quarter
   * @returns {number}
   */
  get quarter():number {
    return ((this.date.getMonth()+1)/4)<<0+1
  }

  /**
   * Getter for project date year as a string
   * @returns {string}
   */
  get dateYear():string {
    return this.year.toString()
  }

  /**
   * Getter for the formatted project date
   * @returns {string}
   */
  get dateFormatted():string {
    const dateFormat = this.copy.dateFormat[this.config.lang]
    return this.datePipe.transform(this.date, dateFormat)
  }

  /**
   * Getter for the url of the project
   * @returns {string}
   */
  get uri():string {
    return `/client/${this.clientNr}/${this.indexOnClient+1}`
  }

  /**
   * Getter for the project client
   * @returns {Client}
   */
  get client():Client {
    return this._client
  }

  /**
   * Getter boolean if the project payment is overdue
   * @returns {boolean}
   */
  get overdue():boolean {
    const dateDiff = +new Date() - +this.dateLatest
    const dateDiffDays = dateDiff/(1000*60*60*24)
    return dateDiffDays>this.data.personal.reminderPeriod
  }

}
