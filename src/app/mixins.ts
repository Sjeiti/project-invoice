import {DatePipe} from '@angular/common'
import {IProject} from './interface/project'

let datePipe:DatePipe = new DatePipe('en')

/**
 * Convert dateTime to date using ng DatePipe
 * @param {string} dateTime
 * @returns {string}
 */
export const dateTimeToDate = (dateTime = '')=> {
  return datePipe.transform(dateTime||(new Date).toString(), 'yyyy-MM-dd')
}

/**
 * Test whether a property is an accessor (as in getter opposed to regular property)
 * @param {object} obj
 * @param {string} prop
 * @returns {boolean}
 */
export const isPropertyAccessor = (obj:any, prop:string):boolean => {
  let desc = Object.getOwnPropertyDescriptor(obj, prop)
  return desc&&desc.hasOwnProperty&&(desc.hasOwnProperty('get')||desc.hasOwnProperty('set'))
}

/**
 * Turns off enumerability of accessors in an object
 * @param {object} obj
 */
export const dontEnumerateAccessors = (obj:any)=>{
    Object.keys(obj)
        .filter(prop=>isPropertyAccessor(this, prop))
        .forEach(prop=>Object.defineProperty(obj, prop, { enumerable:false }))
}
