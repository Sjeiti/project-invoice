import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {
  transform(array: Array<any>, ...filters:Array<string>): Array<any> {
    array&&filters.forEach(filter=>{
      const keyVal = filter.split('=')
      const key = keyVal.shift().match(/\w+/).pop()
      const val = value(keyVal.pop())
      const isNegate = filter.substr(0, 1)==='!'
      if (val!==undefined) {
        array = array.filter(o=>o[key]===val)
      } else {
        array = array.filter(o=>!o[key]===isNegate)
      }
    })
    return array
  }
}

function value(val){
  const numberValue = parseFloat(val)
  if (val===numberValue.toString()) {
    val = numberValue
  } else if (val==='true') {
    val = true
  } else if (val==='false') {
    val = false
  }
  return val
}