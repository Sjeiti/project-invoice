import { Pipe, PipeTransform } from '@angular/core'

/*
 * Usage:
 *   value | object
*/
@Pipe({name: 'total', pure:false})
export class TotalPipe implements PipeTransform {
  transform(value: any[], property:string):number {
    let total = 0
    value.forEach(item=> {
      total += item[property]
    })
    return total
  }
}