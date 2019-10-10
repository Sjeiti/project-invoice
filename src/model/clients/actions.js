import { getClient, getProject/*, getLine, getInvoice*/ } from './factory'

export const ADD_CLIENT = Symbol('ADD_CLIENT')
export const STORE_CLIENT = Symbol('STORE_CLIENT')
export const REMOVE_CLIENT = Symbol('REMOVE_CLIENT')

export const ADD_PROJECT = Symbol('ADD_PROJECT')
export const STORE_PROJECT = Symbol('STORE_PROJECT')
export const REMOVE_PROJECT = Symbol('REMOVE_PROJECT')

export const addClient = nr => ({ type: ADD_CLIENT, client: getClient(nr) })
export const storeClient = client => ({ type: STORE_CLIENT, client })
export const removeClient = clientNr => ({ type: REMOVE_CLIENT, clientNr })

export const addProject = (clientNr, projectNr) => ({
  type: ADD_PROJECT
  , project: getProject(clientNr, projectNr)
})
export const storeProject = project => ({ type: STORE_PROJECT, project })
export const removeProject = projectNr => ({ type: REMOVE_PROJECT, projectId: projectNr })
