import moment from 'moment'
import defaultJSON from './defaultJSON'
import {VERSION} from '../config'
import {getInvoice} from './clients/factory'
import {INVOICE} from '../config/invoice'

const now = Date.now()
const week = 1000*60*60*24*7
const dateString = millis=>moment(new Date(millis)).format('YYYY-MM-DD')

export const data = {...defaultJSON, ...{
  pi: {
    timestamp: now
    , version: VERSION
  }
  , clients: [
    {
      nr: 1
      , name: 'Krusty Krab'
      , address: '831 Bottomfeeder Lane'
      , zipcode: '1000 DG'
      , postbox: ''
      , zippost: ''
      , city: 'Bikini Bottom'
      , phone: ''
      , paymentterm: '21'
      , contact: ''
      , projects: [
        ...Array.from(new Array(2)).map((o, i)=>({
          clientNr: 1
          , id: i
          , description: `${i===0?'One':'Two'} gazillion Krabby Patties`
          , hourlyRate: 33
          , discount: 5
          , lines: [
            {
              description: 'Krabby Patties'
              , hours: (i+1)*55
              , vat: 21
              , amount: (i+1)*1234
            }
            , {
              description: 'spatula greese'
              , hours: 14
              , vat: 21
              , amount: 444
            }
          ]
          , invoices: [
              getInvoice(dateString(now-7*week-i*52*week), INVOICE.type.invoice)
            , getInvoice(dateString(now-4*week-i*52*week), INVOICE.type.reminder)
            , getInvoice(dateString(now-2*week-i*52*week), INVOICE.type.reminder)
            , getInvoice(dateString(now       -i*52*week), INVOICE.type.reminder, true)
          ]
          , paid: i===0
          , quotationDate: dateString(now-8*week)
          , quotationStartDate: dateString(now-8*week)
          , quotationDuration: 7
          , quotationSubject: 'Krabby Patties'
          , quotationBefore: `### project
I, Spongebob Squarepants, hereby solemly swear to make ${i===0?'one':'two'} gazillion Krabby Patties.`
          , quotationAfter: `### finally
Thank you`
        }))
        , ...Array.from(new Array(3)).map((o, i)=>({
          clientNr: 1
          , id: i+21
          , description: `Krusty Krab ${['spring', 'summer', 'autumn'][i]}-cleaning`
          , hourlyRate: 33
          , discount: 5
          , lines: [
            {
              description: 'scrubbing'
              , hours: 723 + 23*i
              , vat: 21
              , amount: 33*(723 + 23*i)
            }
          ]
          , invoices: i===0?[]:[
            getInvoice(dateString(now-i*2*week-i*52))
          ]
          , paid: false
        }))
      ]
    }
  ]
}}

let index = 0
const copy = data.copy
for (let key in copy){
  if (copy.hasOwnProperty(key)){
    copy[key].index = index
    index++
  }
}