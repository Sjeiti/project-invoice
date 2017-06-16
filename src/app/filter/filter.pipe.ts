import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {
  transform(array: Array<any>, ...filters:Array<string>): Array<any> {
    filters.forEach(filter=>{
      const key = filter.match(/\w+/).pop()
      const isNegate = filter.substr(0, 1)==='!'
      array = array.filter(o=>!o[key]===isNegate)
    })
    return array
  }
}