import { Pipe, PipeTransform } from '@angular/core'

/*
 * Usage:
 *   value | object
*/
@Pipe({name: 'object'})
export class ObjectPipe implements PipeTransform {
  transform(value: any, enumerable = true): Object[] {
      const dataArr = []
      if (!enumerable) {
        for (let s in value) { // tslint:disable-line forin
            dataArr.push({key:s, value:value[s]})
        }
      } else {
        Object.keys(value).forEach((key: string) => dataArr.push({key, value:value[key]}))
      }
      return dataArr
  }
}