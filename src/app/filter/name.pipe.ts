import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'name'
})
/**
 * Pipe for filtering by name property
 * @todo can probably be obsoleted by using the more generic filter.pipe.ts
 */
export class NamePipe implements PipeTransform {
  transform(value:any[], name:string):any[] {
    let lowerName = name.toLowerCase()
    return name===''?value:value.filter(item=>item.name.toLowerCase().indexOf(lowerName)!==-1)
  }
}
