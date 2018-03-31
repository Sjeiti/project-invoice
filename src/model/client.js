import { create as createProject } from './project'

/**
 * @typedef {object} client
 * @property {string} address
 * @property {string} city
 * @property {string} contact
 * @property {string} name
 * @property {number} nr
 * @property {number} paymentterm // todo convert to number (days)
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
    return create(cloned,this.model)
  }

  /**
   * Return the client pathname
   * @returns {string}
   */
  ,get uri(){
    return `/client/${this.nr}`
  }

  /**
   * Create a new project
   * @returns {project}
   */
  ,createProject(){
    const projectId = Math.max(...this.projects.map(p=>p.id),0) + 1
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

  /**
   * Get project by index
   * @param {number} index
   * @returns {project}
   * @see project.indexOnClient
   */
  ,getProject(index){
    let project
    this.projects.forEach(p=>p.indexOnClient===index&&(project = p))
    return project
  }

  /**
   * Delete a project by instance
   * @param {project} project
   * @returns {boolean}
   */
  ,deleteProject(project){
    const index = this.projects.indexOf(project)
    const valid = index!==-1
    valid&&this.projects.splice(index,1)
    return valid
  }

  /**
   * Strings
   * @returns {string}
   */
  ,toString(){
    return `[object client '${this.name}']`
  }
}

/**
 * Create a client from an object literal
 * @param {object} client
 * @param {object} model
 * @returns {client}
 */
export function create(client,model){
  client.paymentterm = parseInt(client.paymentterm||21,10) // todo convert to number (days)
  client.projects.forEach((project,i,a)=>{
    a[i] = createProject(project,client,model)
  })
  return Object.setPrototypeOf(client,proto)
}
