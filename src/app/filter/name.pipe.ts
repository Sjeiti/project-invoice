import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {
  transform(value:any[], name:string):any[] {
    let lowerName = name.toLowerCase()
    return name===''?value:value.filter(item=>item.name.toLowerCase().indexOf(lowerName)!==-1)
  }
}