import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'arraySort'
})
export class ArraySortPipe implements PipeTransform {
  transform(array: Array<any>, ...sortBy:Array<string>): Array<any> {
    array.sort((a: any, b: any) => {
      let valueA = 1
      let valueB = 1
      let ascdesc = 1
      sortBy.some(sort=>{
        const key = sort.replace(/^[-+]/, '')
        ascdesc = /^-/.test(sort)?-1:1
        valueA = a[key]
        valueB = b[key]
        return valueA!==valueB
      })
      return valueB<valueA?ascdesc:-ascdesc
    })
    return array
  }
}