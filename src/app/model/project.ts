import {DatePipe} from '@angular/common'
import {IProject} from '../interface/project'
import {IInvoice} from '../interface/invoice'
import {IInvoiceLine} from '../interface/invoice-line'
import {ModelService} from './model.service'
import {dontEnumerateAccessors} from '../mixins'

export class Project implements IProject {

  clientNr:number = -1
  description = ''
  discount = 0
  hourlyRate = 80
  invoiceNr = ''
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
  private config:any
  private datePipe:DatePipe

  private startValue:any[] = [0]

  constructor(
      model:IProject,
      public modelService:ModelService
  ) {
    Object.defineProperty(this, 'modelService', { enumerable:false })
    dontEnumerateAccessors(this)
    for (let name in model) {
      if (model.hasOwnProperty(name)) {
        this[name] = model[name]
      }
    }
    this.datePipe = new DatePipe('en')
    this.personal = this.modelService.getPersonal()
    this.copy = this.modelService.getCopy()
    this.config = this.modelService.getConfig()
  }

  clone(){
    return new Project(this, this.modelService)
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

  get indexOnClient():number {
    let client = this.modelService.getClientByNr(this.clientNr),
        projects = client&&client.projects.sort(this.sortProjectsByDateDescription)||[]
    return projects.indexOf(this)
  }

  get indexOnYear():number {
    let year = this.year,
        projectsInYear = this.modelService.getProjects()
            .filter(project=>project.invoices.length>0&&project.year===year)
            .sort(this.sortProjectsByDateDescription)
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
    const dateFormat = this.copy.dateFormat[this.config.lang];
    return this.datePipe.transform(this.date, dateFormat)
  }

  get uri():string {
    return `/client/${this.clientNr}/${this.invoiceNr}`
  }

  private sortProjectsByDateDescription(a:Project, b:Project){
    return a.date.toString()===b.date.toString()?(a.description>b.description?1:-1):(a.date>b.date?1:-1)
  }

}
