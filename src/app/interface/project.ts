import {IInvoice} from './invoice'
import {IInvoiceLine} from './invoice-line'

export interface IProject {
  clientNr:number
  description:string
  discount:number
  hourlyRate:number
  invoiceNr:string
  invoices:IInvoice[]
  lines:IInvoiceLine[]
  paid:boolean
  quotationDate:string
  quotationStartDate:string
  quotationDuration:number
  quotationAfter:string
  quotationBefore:string
  // getters
  total:number
  totalVat:number
  totalDiscount:number
  totalVatDiscount:number
  totalDiscounted:number
  totalVatDiscounted:number
  totalIncDiscounted:number
}