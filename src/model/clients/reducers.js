import {
  ADD_CLIENT,
  STORE_CLIENT,
  REMOVE_CLIENT,
  ADD_PROJECT,
  STORE_PROJECT,
  REMOVE_PROJECT
} from './actions'
import {getInitialState, storeState} from '../storage'

const dataName = 'clients'
const initialState = getInitialState(dataName)
const save = storeState.bind(null, dataName)

export function clients(state = initialState, action){
  console.log('R_', action.type.toString(), action)

  switch (action.type){
    case ADD_CLIENT:
      return save([action.client, ...state])

    case STORE_CLIENT:
      const clientToStore = action.client
      return save(
        state.map(client => {
          client.nr === clientToStore.nr && Object.assign(client, clientToStore)
          return client
        })
      )

    case REMOVE_CLIENT:
      const { clientNr } = action
      return save(state.filter(client => client.nr !== clientNr))

    case ADD_PROJECT:
      const { project } = action
      return save(
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
      return save(
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
      return save(
        state.map(client => {
          client.projects = client.projects.filter(project => project.id !== projectId)
          return client
        })
      )

    default:
      return state
  }
}