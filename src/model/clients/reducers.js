import {
  ADD_CLIENT,
  STORE_CLIENT,
  REMOVE_CLIENT,
  ADD_PROJECT,
  STORE_PROJECT,
  REMOVE_PROJECT
} from './actions'
import defaultModel from './default'

const initialState = getStorage('clients') || defaultModel
const storeClients = setStorage.bind(null, 'clients')

export function clients(state = initialState, action){
  console.log('R_', action.type.toString(), action)

  switch (action.type){
    case ADD_CLIENT:
      return storeClients([action.client, ...state])

    case STORE_CLIENT:
      const clientToStore = action.client
      return storeClients(
        state.map(client => {
          client.nr === clientToStore.nr && Object.assign(client, clientToStore)
          return client
        })
      )

    case REMOVE_CLIENT:
      const { clientNr } = action
      return storeClients(state.filter(client => client.nr !== clientNr))

    case ADD_PROJECT:
      const { project } = action
      return storeClients(
        state.map(client => {
          client.nr === project.clientNr && client.projects.push(project)
          return client
        })
      )

    case STORE_PROJECT:{
      const {
        project: projectToStore,
        project: { id, clientNr }
      } = action
      return storeClients(
        state.map(client => {
          client.nr === clientNr &&
            client.projects.forEach(project => {
              project.id === id && Object.assign(project, projectToStore)
            })
          return client
        })
      )
    }

    case REMOVE_PROJECT:
      const { projectId } = action
      return storeClients(
        state.map(client => {
          client.projects = client.projects.filter(project => project.id !== projectId)
          return client
        })
      )

    default:
      return state
  }
}

/**
 * Get and parse localStorage content
 * @param {string} name
 * @todo clean and move to service/facade/whatever
 */
function getStorage(name){
  const stringData = window.localStorage.getItem(name)
  return stringData && JSON.parse(stringData)
}

/**
 * Set localStorage
 * @param {string} name
 * @param {object} data
 * @todo clean and move to service/facade/whatever
 */
function setStorage(name, data){
  data && window.localStorage.setItem(name, JSON.stringify(data))
  return data
}
