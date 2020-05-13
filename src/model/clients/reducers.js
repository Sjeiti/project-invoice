import {
  // SET_CLIENTS,
  ADD_CLIENT,
  STORE_CLIENT,
  REMOVE_CLIENT,
  ADD_PROJECT,
  STORE_PROJECT,
  REMOVE_PROJECT,
  CLONE_PROJECT
} from './actions'
import {getInitialState} from '../storage'
import {cloneDeep} from 'lodash'
import {getClonedDescription, getNextProjectNr} from './selectors'

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
          if (client.nr === project.clientNr) {
            client = Object.assign({}, client)
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

    case CLONE_PROJECT:
      const cloneProjectId = parseInt(action.projectId, 10)
      const nextProjectNr = getNextProjectNr(state)
      return state.map(client => {
          const project = client.projects.find(project => project.id === cloneProjectId)
          if (project) {
            const clonedProject = cloneDeep(project)
            clonedProject.id = nextProjectNr
            clonedProject.ignore = false
            clonedProject.invoices.length = 0
            clonedProject.description += ' (clone)'
            clonedProject.description = getClonedDescription(client, project)
            client = Object.assign({}, client)
            client.projects = [...client.projects, clonedProject]
          }
          return client
        })

    default:
      return state
  }
}