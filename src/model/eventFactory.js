import {getClientHref,getLatestClient,getNextClientNr,getNextProjectNr,getProjectHref} from './clients/selectors'

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