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
}

export function create(client, model){
    client.projects.forEach((project,i,a)=>{
      a[i] = createProject(project, client, model)
    })
    return Object.setPrototypeOf(client, proto);
}
