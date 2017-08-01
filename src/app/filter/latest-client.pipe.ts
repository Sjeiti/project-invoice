import {Pipe, PipeTransform} from '@angular/core'
import {IClient} from '../interface/client'
import {Project} from '../model/project'

@Pipe({
  name: 'latestClient'
})
/**
 * Pipe to sort clients to date by their last invoice
 */
export class LatestClientPipe implements PipeTransform {

  transform(clients: IClient[]): IClient[] {
    return clients.sort((a:IClient, b:IClient)=> {
      let latestA:Date = this.getLatestProjectDate(a),
          latestB:Date = this.getLatestProjectDate(b)
      return latestA>latestB?-1:1
    })
  }

  private getLatestProjectDate(client:IClient):Date {
    let latestDate:Date = new Date(0)
    client.projects.forEach((project:Project)=> {
      let projectDate:Date = project.dateLatest
      if (projectDate>latestDate) {
        latestDate = projectDate
      }
    })
    return latestDate
  }

}
