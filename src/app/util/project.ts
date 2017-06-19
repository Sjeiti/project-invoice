import {Project} from '../model/project'

/**
 * Sort projects by first invoice date, then by index
 * @param {Project} a
 * @param {Project} b
 * @returns {number}
 */
function projectSort(a:Project, b:Project){
  return a.date.toString()===b.date.toString()?(a.id>b.id?1:-1):(a.date>b.date?1:-1)
}

export {
  projectSort
}