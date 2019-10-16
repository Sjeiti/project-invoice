import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, nbsp} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject} from '../model/clients/actions'
import {getClient, getProject, getClients, getClientHref} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Input} from '../components/Input'
import {T} from '../components/T'

const editablePropNames = ['description', 'id', 'hourlyRate', 'discount', 'paid', 'quotationDate']

export const Project = withRouter(
  connect(
    state => ({ clients: getClients(state) }),
    { storeProject, removeProject }
  )(
    ({
      history,
      match: {
        params: { client: clientNr, project: projectId }
      },
      storeProject,
      removeProject,
      clients
    }) => {
      const client = getClient(clients, clientNr)
      const project = client && getProject(client.projects, projectId)
      const isProject = !!project

      const editableProps =
        isProject && editablePropNames.map(key => [key, ...useState(project[key])]) || null
      const editablePropsMap =
        editableProps?.reduce((acc, [key, val]) => ((acc[key] = val), acc), {})

      useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
      if (isProject){
        const newProject = {
          ...project
          , ...editableProps.reduce((acc, [key, val]) => ((acc[key] = val), acc), {})
        }
        const isDirty = !isEqual(project, newProject)
        const revert = isDirty && (() => editableProps.forEach(([key, val, set]) => set(project[key]))) || null
        const save = isDirty && storeProject.bind(null, newProject) || null
        const deleet = removeProject.bind(null, project.id)
        saveable.dispatch(true, save, revert, deleet)
      } else {
        history.push((client && getClientHref(client)) || '/clients')
      }

      return (
        (isProject && (
          <>
            <h3>
              <Link to={getClientHref(client)}>{client.name||nbsp}</Link>
            </h3>
            <h2>{editablePropsMap.description||nbsp}</h2>
            <form>
              {editableProps.map(
                ([key, value, setValue], index) =>
                  key !== 'id' && (
                    <Label key={index}>
                      <T>{key}</T>
                      <Input value={value} setter={setValue} />
                    </Label>
                  )
              )}
            </form>

            <section>
              <h3><T>lines</T></h3>
              {project.lines.map((line, i) => (
                <div key={i}>
                  {Object.entries(line).map(([key, value], j) => (
                    <span key={j}>
                      <T>{key}</T>:{value}{' '}
                    </span>
                  ))}
                </div>
              ))}
            </section>
          </>
        )) || <p><T>project not found</T></p>
      )
    }
  )
)
