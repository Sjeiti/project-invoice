import {stopPropagation} from '../../utils'

/**
 * Mark project as paid
 * @param {Project} project
 * @param {Function} storeProject
 * @param {MouseEvent} e
 */
export function onClickPaid(project, storeProject, e){
  storeProject(Object.assign({}, project, { paid: !project.paid }))
  stopPropagation(e)
}
