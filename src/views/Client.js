import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import {isEqual, nbsp} from '../utils'
import {
  getClients,
  getClient,
  getProjectHref,
  getProjectNr,
  getProjectDate,
  getProjectDateLatest,
  getTotalIncDiscounted
} from '../model/clients/selectors'
import {getNewProjectEvents} from '../model/eventFactory'
import { storeClient, removeClient, addProject } from '../model/clients/actions'
import { saveable } from '../saveable'
import { Label } from '../components/Label'
import { ButtonLink } from '../components/ButtonLink'
import { Price } from '../components/Price'
import { Table } from '../components/Table'
import {Input} from '../components/Input'
import {T} from '../components/T'

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
    { storeClient, removeClient, addProject }
  )(({ history, match, clients, storeClient, removeClient, addProject }) => {
    const client = getClient(clients, parseInt(match.params.client, 10))
    const isClient = !!client
    const editableProps = isClient && editablePropNames.map(key => [key, ...useState(client[key])])

    useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
    if (isClient){
      const newClient = {
        ...client
        , ...editableProps.reduce((acc, [key, val]) => ((acc[key] = val), acc), {})
      }
      const isDirty = !isEqual(client, newClient)
      const revert = isDirty && (() => editableProps.forEach(([key, val, set]) => set(client[key]))) || null
      const save = isDirty && storeClient.bind(null, newClient) || null
      const deleet = removeClient.bind(null, client.nr)
      saveable.dispatch(true, save, revert, deleet)
    } else {
      history.push('/clients')
    }

    const projectListProjects = client.projects.map(project => ({
      ...project
      , onClick: () => history.push(getProjectHref(project))
      // todo: make paid click functional
      , paid: <Input value={project.paid} style={{margin:'0.25rem 0 0'}} />
      , nr: getProjectNr(project)
      , date: getProjectDate(project)
      , dateLatest: getProjectDateLatest(project)
      , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    }))

    const newProjectEvents = getNewProjectEvents(clients, client, addProject)

    return (
      (isClient && (
        <>
          <h3>{editableProps[0][1]||nbsp}</h3>
          <form>
            {editableProps.map(
              ([key, value, setValue], index) =>
                key !== 'nr' && (
                  <Label key={index}>
                    <T>{key}</T>
                    <Input value={value} setter={setValue} />
                  </Label>
                )
            )}
          </form>
          <hr/>
          <section>
            <ButtonLink {...newProjectEvents} className="float-right"><T>new project</T></ButtonLink>
            <h3><T>projects</T></h3>
            <Table
              cols="paid nr date dateLatest description totalIncDiscounted"
              projects={projectListProjects}
              sort="date" // todo
              asc="false" // todo
              empty={['This client has no projects :-/, ', <Link {...newProjectEvents} key={0}>create one</Link>]}
            />
          </section>
        </>
      )) || <p>Client not found</p>
    )
  })
)