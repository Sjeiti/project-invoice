import {InjectionToken} from '@angular/core'

export let INVOICE_CONFIG = new InjectionToken('invoice.config')

export interface IInvoiceConfig {
  typeInvoice:string
  typeReminder:string
}

export const InvoiceConfig:IInvoiceConfig = {
  typeInvoice: 'invoice',
  typeReminder: 'reminder'
}