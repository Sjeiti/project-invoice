import { Pipe, PipeTransform } from '@angular/core'

/**
 * Pipe to traverse objects as an array
 * @example
<dl class="row">
  <ng-template ngFor let-item [ngForOf]="personal | object">
    <dt [appExplain]="'data.'+item.key"></dt>
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
