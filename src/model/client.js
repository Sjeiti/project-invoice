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
  get fooClient(){return 'barClient'}
}

export function create(client, model){
    client.projects.forEach((project,i,a)=>{
      a[i] = createProject(project, client, model)
    })
    return Object.setPrototypeOf(client, proto);
}
