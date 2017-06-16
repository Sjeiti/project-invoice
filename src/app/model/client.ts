import {IClient} from '../interface/client'
import {IProject} from '../interface/project'
import {dontEnumerateAccessors} from '../mixins'
import {Project} from './project'

export class Client implements IClient {

  address = ''
  city = ''
  contact = ''
  name = ''
  nr = -1
  paymentterm = ''
  phone = ''
  postbox = ''
  projects:IProject[] = []
  zipcode = ''
  zippost = ''

  constructor(model:IClient) {
    dontEnumerateAccessors(this)
    for (let name in model) {
      if (model.hasOwnProperty(name)) {
        this[name] = model[name]
      }
    }
  }

  clone(){
    return new Client(this)
  }

  get lastInvoiceNr():number {
    return this.projects.filter(project=>project.invoices.length>0).length
  }

  get lastProjectDate():Date {
    let date = new Date(0)
    this.projects.map((project:Project)=>project.date).forEach(projectDate=>{
      // if (projectDate.getTime()>date.getTime()) {
      if (projectDate>date) {
        date = projectDate
      }
    })
    return date
  }

}
