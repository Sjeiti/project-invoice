import {
  // SET_CLIENTS,
  ADD_CLIENT,
  STORE_CLIENT,
  REMOVE_CLIENT,
  ADD_PROJECT,
  STORE_PROJECT,
  REMOVE_PROJECT
} from './actions'
import {getInitialState} from '../storage'

const dataName = 'clients'
const initialState = getInitialState(dataName)

export function clients(state = initialState, action){

  switch (action.type){
    // case SET_CLIENTS:
    //   return save(action.clients)

    case ADD_CLIENT:
      return [action.client, ...state]

    case STORE_CLIENT:
      const clientToStore = action.client
      return state.map(client =>
          client.nr === clientToStore.nr && Object.assign({}, client, clientToStore) || client
        )

    case REMOVE_CLIENT:
      const { clientNr } = action
      return state.filter(client => client.nr !== clientNr)

    case ADD_PROJECT:
      const { project } = action
      return state.map(client => {
          // client.nr === project.clientNr && client.projects.push(project) // freeze prevents this
          client = Object.assign({}, client)
          if (client.nr === project.clientNr) {
            client.projects = [...client.projects, project]
          }
          return client
        })

    case STORE_PROJECT: {
      const {
        project: projectToStore,
        project: { id, clientNr }
      } = action
      return state.map(client => {
        if (client.nr === clientNr) {
          client = Object.assign({}, client)
          client.projects = client.projects.map(project =>
            project.id === id && Object.assign({}, project, projectToStore) || project
          )
        }
        return client
      })
    }

    case REMOVE_PROJECT:
      const { projectId } = action
      return state.map(client => {
          client = Object.assign({}, client)
          client.projects = client.projects.filter(project => project.id !== projectId)
          return client
        })

    default:
      return state
  }
}