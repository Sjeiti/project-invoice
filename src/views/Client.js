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
    const clientOld = getClient(clients, parseInt(match.params.client, 10))
    const isClient = !!clientOld
    const editableProps = isClient && editablePropNames.map(key => [key, ...useState(clientOld[key])])

    const [client, setClient] = useState(clientOld)

    useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
    if (isClient){
      const isDirty = !isEqual(clientOld, client)
      saveable.dispatch(
          true
          , isDirty && storeClient.bind(null, client) || null
          , isDirty && (() => setClient(clientOld)) || null
          , removeClient.bind(null, clientOld.nr)
      )
    } else {
      history.push('/clients')
    }

    const projectListProjects = clientOld.projects.map(project => ({
      ...project
      , onClick: () => history.push(getProjectHref(project))
      // todo: make paid click functional
      , paid: <Input value={project.paid} style={{margin:'0.25rem 0 0'}} />
      , nr: getProjectNr(project)
      , date: getProjectDate(project)
      , dateLatest: getProjectDateLatest(project)
      , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    }))

    const newProjectEvents = getNewProjectEvents(clients, clientOld, addProject)

    const getSetter = key => value =>
        setClient({...client, ...[key, value].reduce((acc, v)=>(acc[key]=v, acc), {})})

    return (
      (isClient && (
        <>
          <h3>{editableProps[0][1]||nbsp}</h3>
          <form>
            {editablePropNames.map(
              (key, index) =>
                key !== 'nr' && (
                  <Label key={index}>
                    <T>{key}</T>
                    <Input value={client[key]} setter={getSetter(key)} />
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
              subjects={projectListProjects}
              sort="date" // todo
              asc="false" // todo
              empty={[<T>clientNoProjects</T>,', ', <Link {...newProjectEvents} key={0}><T>create one</T></Link>]}
            />
          </section>
        </>
      )) || <p>Client not found</p>
    )
  })
)
