import {DatePipe} from '@angular/common'
import {IProject} from './interface/project'

let datePipe:DatePipe = new DatePipe('en')

export const dateTimeToDate = (dateTime = '')=> {
  return datePipe.transform(dateTime||(new Date).toString(), 'yyyy-MM-dd')
}

export const isPropertyAccessor = (obj:any, prop:string):boolean => {
  let desc = Object.getOwnPropertyDescriptor(obj, prop)
  return desc&&desc.hasOwnProperty&&(desc.hasOwnProperty('get')||desc.hasOwnProperty('set'))
}

export const dontEnumerateAccessors = (obj:any)=>{
    Object.keys(obj)
        .filter(prop=>isPropertyAccessor(this, prop))
        .forEach(prop=>Object.defineProperty(obj, prop, { enumerable:false }))
}