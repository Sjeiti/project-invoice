import { create as createProject } from './project'

/**
 * @typedef {object} client
 * @property {string} address
 * @property {string} city
 * @property {string} contact
 * @property {string} name
 * @property {number} nr
 * @property {string} paymentterm
 * @property {string} phone
 * @property {string} postbox
 * @property {project[]} projects
 * @property {string} zipcode
 * @property {string} zippost
 */

const proto = {

  /**
   * Returns an exact clone of the project
   * @returns {client}
   */
  clone(){
    const cloned = JSON.parse(JSON.stringify(this))
    return create(cloned, this.model)
  }

  ,get uri(){
    return `/client/${this.nr}`
  }

  ,createProject(){
    const projectId = Math.max(...this.projects.map(p=>p.id)) + 1
    const project = createProject({
      clientNr: this.nr
      ,description: `project ${projectId}`
      ,id: projectId
      ,hourlyRate: 90
      ,discount: 0
      ,invoices: []
      ,lines: []
      ,paid: false
    },this,this.model)
      project.addLine()
      this.projects.push(project)
    return project
  }

  ,deleteProject(project){
    const index = this.projects.indexOf(project)
    const valid = index!==-1
    valid&&this.projects.splice(index,1)
    return valid
  }
}

export function create(client, model){
  client.projects.forEach((project,i,a)=>{
    a[i] = createProject(project, client, model)
  })
  return Object.setPrototypeOf(client, proto);
}
