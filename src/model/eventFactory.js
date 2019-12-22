import {
  getClientHref
  , getNextClientNr
  , getCloneProjectHref
  , getNextProjectNr
  , getProjectHref
  , getPreviousProjectHref
  , getNextProjectHref
} from './clients/selectors'

export function getNewClientEvents(clients, addClient) {
  const newClientNr = getNextClientNr(clients)
  return {
    onClick: addClient.bind(null, newClientNr)
    , to: getClientHref({ nr: newClientNr })
  }
}

export function getNewProjectEvents(clients, client, addProject){
  const nextProjectNr = getNextProjectNr(clients)
  return {
    onClick: addProject.bind(null, client?.nr, nextProjectNr)
    , to: getProjectHref({ clientNr: client?.nr, id: nextProjectNr })
  }
}

export function getCloneProjectEvents(clients, project, cloneProject){
  return {
    onClick: cloneProject.bind(null, project.id)
    , to: getCloneProjectHref(clients, project)
  }
}

export function getPreviousProjectEvents(client, project){
  return prevNextEvent(client, project, getPreviousProjectHref)
}

export function getNextProjectEvents(client, project){
  return prevNextEvent(client, project, getNextProjectHref)
}

function prevNextEvent(client, project, getHref){
  const to = getHref(client, project)
  return { disabled: to==='#', to }
}