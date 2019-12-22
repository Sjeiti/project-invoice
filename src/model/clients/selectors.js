/**
 * Get all clients
 * @param {object} state
 * @returns {client[]}
 */
import {project} from './project'

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
  return clients && Math.max(0, ...clients.map(client => client.nr))
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

////////////////////////////////////////////////////////////////////////////////////////

export const getClientHref = client => `/client/${client.nr}`

export const getProjectHref = project => getClientProjectHref(project.clientNr, project.id)

export const getCloneProjectHref = (clients, project) => getClientProjectHref(project.clientNr, getNextProjectNr(clients))

export const getPreviousProjectHref = (client, project) => {
  const {projects} = client
  const currentIndex = projects.indexOf(project)
  return currentIndex>0?getClientProjectHref(project.clientNr, projects[currentIndex-1].id):'#'
}

export const getNextProjectHref = (client, project) => {
  const {projects} = client
  const currentIndex = projects.indexOf(project)
  return currentIndex<projects.length-1?getClientProjectHref(project.clientNr, projects[currentIndex+1].id):'#'
}

const getClientProjectHref = (clientID, projectID) => `/client/${clientID}/${projectID}`

////////////////////////////////////////////////////////////////////////////////////////

const cleanDescription = description => description.replace(/\s\(clone\s?\d*\)/, '')

const countOccurrences = (arr, val) => arr.reduce((acc, arrVal) => (arrVal === val ? acc + 1 : acc), 0)

export const getClonedDescription = (client, project) => {
  const {description} = project
  const cleanedDescription = cleanDescription(description)
  const num = countOccurrences(client.projects.map(({description}) => cleanDescription(description)), cleanedDescription)
  return `${cleanedDescription} (clone${num>1?' '+num:''})`
}

////////////////////////////////////////////////////////////////////////////////////////

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


export const getDiscountPart = project => 1 - project.discount / 100

export const getTotalHours = project =>
    project.lines.reduce((acc, { hours }) => acc + hours, 0)

export const getTotal = project =>
    project.lines.reduce((acc, { amount }) => acc + amount, 0)

export const getTotalVAT = project =>
    project.lines.reduce((acc, { vat, amount }) => acc + amount * (vat/100), 0)

export const getTotalDiscounted = project =>
    getDiscountPart(project)*getTotal(project)

export const getTotalVATDiscounted = project =>
    getDiscountPart(project)*getTotalVAT(project)

export const getTotalIncDiscounted = project =>
    getTotalDiscounted(project) + getTotalVATDiscounted(project)


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
  // //###########################
  // const allP = allProjectsByDate(clients)
  // if (allP.length>1) {
  //   console.log('allP',allP) // todo: remove log
  //   console.log('\t',[...allP].pop()) // todo: remove log
  // }
  // //#############################
  return allProjectsByDate(clients).pop()
}

/**
 * Get the latest client
 * @param {client[]} clients
 * @return {client}
 */
export function getLatestClient(clients) {
  return getClient(clients, getLatestProject(clients)?.clientNr)
}

export function getOpenProjects(clients) {
  return allProjectsByDate(clients).filter(project => !project.paid&&project.invoices.length)
}

export function getDraftProjects(clients) {
  return allProjectsByDate(clients).filter(project => !project.invoices.length)
}

/**
 * Calculate the invoice number by interpolating the template
 * @returns {string}
 * @todo maybe only interpolate like this at one single point
 */
export function getProjectNumber(_project, state){
  const {clients, config:{projectNumberTemplate}} = state
  const client = getClient(clients, _project.clientNr)
  const betterProject = project(_project, {_client:client, model:state})
  return (new Function('project', 'client', 'return `'+projectNumberTemplate+'`'))(betterProject, client)
}

/**
 * Return the years of the projects
 * @param {client[]} clients
 * @return {string[]}
 */
export function getProjectsYears(clients) {
  return allProjectsByDate(clients)
      .filter(project => project.invoices.length)
      .map(project => project.invoices[0].date.substr(0,4))
      .filter((year, i, a) => a.indexOf(year)===i)
      .sort()
}

/**
 * Return the years of the projects
 * @param {client[]} clients
 * @param {string} year
 * @return {string[]}
 */
export function getProjectsOfYearQuarter(clients, year, quarter) {
  return allProjectsByDate(clients)
      .filter(project => project.invoices.length&&[0,0,0].map((n,i)=>`${year}-${(quarter*3+i+1).toString().padStart(2, '0')}`).includes(project.invoices[0].date.substr(0,7)))
      // .map(project => project.invoices[0].date.substr(0,4))
      // .filter((year, i, a) => a.indexOf(year)===i)
      // .reverse()
}