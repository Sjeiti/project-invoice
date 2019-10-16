import moment from 'moment'
import defaultJSON from './defaultJSON'
import {VERSION} from '../config'

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
              , hours: 55
              , vat: 21
              , amount: 1234
            }
            , {
              description: 'spatula greese'
              , hours: 14
              , vat: 21
              , amount: 444
            }
          ]
          , invoices: [
            {
              date: dateString(now-7*week-i*52)
              , type: 'invoice'
            }
            , {
              date: dateString(now-4*week-i*52)
              , type: 'reminder'
            }
            , {
              date: dateString(now-2*week-i*52)
              , type: 'reminder'
            }
            , {
              date: dateString(now-i*52)
              , type: 'reminder'
              , interest: true
            }
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
          , description: 'Krusty Krab spring-cleaning'
          , hourlyRate: 33
          , discount: 5
          , lines: [
            {
              description: 'Krabby Patties'
              , hours: 823
              , vat: 21
              , amount: 12345
            }
          ]
          , invoices: i===0?[]:[
            {
              date: dateString(now-i*52*week)
              , type: 'invoice'
            }
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