import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {
  transform(array: Array<any>, ...filters:Array<string>): Array<any> {
    array&&filters.forEach(filter=>{
      const keyVal = filter.split('=')
      const key = keyVal.shift() // filter.match(/\w+/).pop()
      const val = keyVal.pop()
      // console.log('key',key); // todo: remove log
      const isNegate = filter.substr(0, 1)==='!'
      if (val) {
        array = array.filter(o=>o[key]===val)
      } else {
        array = array.filter(o=>!o[key]===isNegate)
      }
    })
    return array
  }
}