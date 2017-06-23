import {DatePipe} from '@angular/common'
import {IProject} from '../interface/project'
import {IInvoice} from '../interface/invoice'
import {IInvoiceLine} from '../interface/invoice-line'
import {ModelService} from './model.service'
import {Client} from './client'
import {dontEnumerateAccessors} from '../mixins'
import {projectSort} from '../util/project'
import {IData} from '../interface/store-data'

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
   * @param model
   * @param forClient:Client
   * @param modelService
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

  clone(){
    return new Project(this, this.client, this.modelService)
  }

  get invoiceNr():string {
    return this.modelService.calculateInvoiceNr(this) // todo move method to here
  }

  get invoiceNum():number {
    return this.invoices.length
  }

  get total():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.amount)
  }
  get totalVat():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.amount*0.01*line.vat)
  }
  get totalDiscount():number {
    return this.total*0.01*this.discount
  }
  get totalVatDiscount():number {
    return this.totalVat*0.01*this.discount
  }
  get totalDiscounted():number {
    return this.total-this.totalDiscount
  }
  get totalVatDiscounted():number {
    return this.totalVat-this.totalVatDiscount
  }
  get totalIncDiscounted():number {
    return this.totalDiscounted+this.totalVatDiscounted
  }
  get totalIncDiscountedInterest():number {
    return this.totalIncDiscounted + this.interest
  }


  get interest():number{
    return (this.daysLate/365)*(0.01*this.personal.interestAmount)*this.total
  }

  get daysLate():number{
    let today = new Date,
      diffMillis = today.getTime()-this.date.getTime(),
      day = 1000*60*60*24
    return diffMillis/day<<0
  }

  get date():Date{
    return this.invoices.length!==0?new Date(this.invoices[0].date):new Date()
  }

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

  get hourlyRateDiscounted():number {
    return this.hourlyRate - 0.01*this.discount*this.hourlyRate
  }
  get totalHours():number {
    return this.startValue.concat(this.lines).reduce((acc, line)=>acc+line.hours)
  }

  /**
   * Get the index of the project on the client.projects by checking the id
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

  get indexOnYear():number {
    let year = this.year,
        projectsInYear = this.modelService.getProjects()
            .filter(project=>project.invoices.length>0&&project.year===year)
            .sort(projectSort)
    return projectsInYear.indexOf(this)
  }

  get timestamp():number {
    return this.date.getTime()
  }

  get timestampLatest():number {
    return this.dateLatest.getTime()
  }

  get year():number {
    return this.date.getFullYear()
  }

  get quarter():number {
    return ((this.date.getMonth()+1)/4)<<0+1
  }

  get dateYear():string {
    return this.year.toString()
  }

  get dateFormatted():string {
    const dateFormat = this.copy.dateFormat[this.config.lang]
    return this.datePipe.transform(this.date, dateFormat)
  }

  get uri():string {
    return `/client/${this.clientNr}/${this.indexOnClient+1}`
  }

  get client():Client {
    return this._client
  }

  get overdue():boolean {
    const dateDiff = +new Date() - +this.dateLatest
    const dateDiffDays = dateDiff/(1000*60*60*24)
    return dateDiffDays>this.data.personal.reminderPeriod
  }

}
