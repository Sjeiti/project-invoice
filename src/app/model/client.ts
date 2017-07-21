import {IClient} from '../interface/client'
import {IProject} from '../interface/project'
import {dontEnumerateAccessors} from '../mixins'
import {Project} from './project'
import {projectSort} from '../util/project'

/**
 * Client class
 */
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

  /**
   * Constructor
   * @param {IClient} model
   */
  constructor(model:IClient) {
    dontEnumerateAccessors(this)
    for (let name in model) {
      if (model.hasOwnProperty(name)) {
        this[name] = model[name]
      }
    }
  }

  /**
   * Clone the current client
   * @returns {Client}
   */
  clone(){
    return new Client(this)
  }

  /**
   * Get the date of the most recent project for this client
   * @returns {Date}
   */
  get lastProjectDate():Date {
    let date = new Date(0)
    this.projects.map((project:Project)=>project.date).forEach(projectDate=>{
      if (projectDate>date) {
        date = projectDate
      }
    })
    return date
  }

  /**
   * Getter for the url of this client
   * @returns {string}
   */
  get uri():string {
    return '/client/'+this.nr
  }

  /**
   * Sort projects by date
   * @returns {IProject[]}
   */
  sortProjects():IProject[] {
    return this.projects.sort(projectSort)
  }
}
