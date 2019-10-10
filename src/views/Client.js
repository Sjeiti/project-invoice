import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { isEqual } from '../utils'
import {
  getClients,
  getClient,
  getNextProjectNr,
  getProjectHref,
  getProjectNr,
  getProjectDate,
  getProjectDateLatest,
  getTotalIncDiscounted
} from '../model/clients/selectors'
import { Label } from '../components/Label'
import { Price } from '../components/Price'
import { saveable } from '../saveable'
import { storeClient, removeClient, addProject } from '../model/clients/actions'
import { ProjectList } from '../components/ProjectList'
import {Input} from '../components/Input'

const editablePropNames = [
  'name'
  , 'nr'
  , 'address'
  , 'city'
  , 'contact'
  , 'paymentterm'
  , 'phone'
  , 'postbox'
  , 'zipcode'
  , 'zippost'
]

export const Client = withRouter(
  connect(
    state => ({ clients: getClients(state) }),
    { storeCLient: storeClient, removeClient, addProject }
  )(({ history, match, clients, storeCLient, removeClient, addProject }) => {
    const client = getClient(clients, parseInt(match.params.client, 10))
    const isClient = !!client
    const editableProps = isClient && editablePropNames.map(key => [key, ...useState(client[key])])
    const nextProjectNr = getNextProjectNr(clients)
    const addClientProject = isClient && addProject.bind(null, client.nr, nextProjectNr)

    useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
    if (isClient){
      const newClient = {
        ...client
        , ...editableProps.reduce((acc, [key, val]) => ((acc[key] = val), acc), {})
      }
      const isDirty = !isEqual(client, newClient)
      const revert = isDirty && (() => editableProps.forEach(([key, val, set]) => set(client[key]))) || null
      const save = isDirty && storeCLient.bind(null, newClient) || null
      const deleet = removeClient.bind(null, client.nr)
      saveable.dispatch(true, save, revert, deleet)
    } else {
      history.push('/clients')
    }

    const projectListProjects = client.projects.map(project => ({
      ...project
      , onClick: () => history.push(getProjectHref(project))
      , paid: project.paid ? 'v' : 'x'
      , nr: getProjectNr(project)
      , date: getProjectDate(project)
      , dateLatest: getProjectDateLatest(project)
      , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    }))

    return (
      (isClient && (
        <>
          <h3>{editableProps[0][1]}</h3>
          <form>
            {editableProps.map(
              ([key, value, setValue], index) =>
                key !== 'nr' && (
                  <Label key={index}>
                    {key}
                    <Input value={value} setter={setValue} />
                  </Label>
                )
            )}
          </form>
          <section>
            <Link
              onClick={addClientProject}
              to={getProjectHref({ clientNr: client.nr, id: nextProjectNr })}
              className="btn float-right"
            >
              New project
            </Link>
            <h3>projects</h3>
            <ProjectList
              cols="paid nr date dateLatest description totalIncDiscounted"
              projects={projectListProjects}
              sort="date" // todo
              asc="false" // todo
              empty="This client has no projects :-/"
            />
          </section>
        </>
      )) || <p>Client not found</p>
    )
  })
)
