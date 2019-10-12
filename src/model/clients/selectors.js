/**
 * Get all clients
 * @param {object} state
 * @returns {client[]}
 */
export const getClients = state => [...state.clients]

/**
 * Get client by clientNr
 * @param {client[]} clients
 * @param {number} clientNr
 * @returns {client}
 */
export const getClient = (clients, clientNr) => {
  const clientNumber = parseInt(clientNr, 10)
  return clients?.filter(client => client.nr === clientNumber).pop()
}

/**
 * Get highest client nr
 * @param {client[]} clients
 * @returns {number}
 */
export const getHighestClientNr = clients => {
  return clients && Math.max(...clients.map(client => client.nr))
}

/**
 * Get highest client nr + 1
 * @param {client[]} clients
 * @returns {number}
 */
export const getNextClientNr = clients => {
  return getHighestClientNr(clients) + 1
}

/**
 * Get highest project nr
 * @param {client[]} clients
 * @returns {number}
 * @todo rename project.id to nr _or_ client.nr to id
 */
export const getHighestProjectNr = clients => {
  return (
    clients &&
    Math.max(
      ...clients.reduce(
        (acc, client) => (acc.push(...client.projects.map(project => project.id)), acc),
        []
      )
    )
  )
}

/**
 * Get highest project nr + 1
 * @param {object[]} clients
 * @returns {number}
 */
export const getNextProjectNr = clients => {
  return getHighestProjectNr(clients) + 1
}

/**
 * Get project by projectId
 * @param {object[]} projects
 * @param {number} projectId
 * @returns {object}
 */
export const getProject = (projects, projectId) => {
  const projectNumber = parseInt(projectId, 10)
  return projects && projects.filter(project => project.id === projectNumber).pop()
}

export const getClientHref = client => `/client/${client.nr}`

export const getProjectHref = project => `/client/${project.clientNr}/${project.id}`

export const getProjectNr = project => {
  return `${project.clientNr}-${project.id}`
}

export const getProjectDate = project => {
  return (project.invoices.length && project.invoices[0].date) || project.quotationDate
}

export const getProjectDateLatest = project => {
  const { length } = project.invoices
  return (length && project.invoices[length - 1].date) || project.quotationDate
}

export const getTotalIncDiscounted = project =>
  project.lines.reduce((acc, { amount }) => acc + amount, 0)

function allProjects(clients){
  return clients.reduce((acc,client)=>(acc.push(...client.projects), acc), [])
}

/**
 * Get all projects sorted by date
 * @param {client[]} clients
 * @returns {project[]}
 */
function allProjectsByDate(clients) {
  return allProjects(clients).sort((a,b)=>new Date(a.dateLatest)>new Date(b.dateLatest)?1:-1)
}

/**
 * Get the last project
 * @param {client[]} clients
 * @returns {project}
 */
export function getLatestProject(clients) {
  return allProjectsByDate(clients).pop()
}

/**
 * Get the latest client
 * @param {client[]} clients
 * @return {client}
 */
export function getLatestClient(clients) {
  return getClient(clients, getLatestProject(clients).clientNr)
}

export function getOpenProjects(clients) {
  return allProjectsByDate(clients).filter(project => !project.paid&&project.invoices.length)
}

export function getDraftProjects(clients) {
  return allProjectsByDate(clients).filter(project => !project.invoices.length)
}