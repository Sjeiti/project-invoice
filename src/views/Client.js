import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, keyMap, nbsp} from '../util'
import {
  getClients,
  getClient,
  getProjectHref,
  getProjectNumber,
  getProjectDate,
  getProjectDateLatest,
  getTotalIncDiscounted
} from '../model/clients/selectors'
import {getNewProjectEvents} from '../model/eventFactory'
import {storeClient, removeClient, addProject, storeProject} from '../model/clients/actions'
import {saveable} from '../util/signal'
import {Label} from '../components/Label'
import {ButtonLink} from '../components/ButtonLink'
import {Price} from '../components/Price'
import {Table} from '../components/Table'
import {InputCheckbox, InputText, InputNumber} from '../components/Input'
import {T} from '../components/T'
import {onClickPaid} from '../model/clients/util'

const editablePropNames = [
  {key:'name', input:InputText}
  , {key:'address', input:InputText}
  , {key:'city', input:InputText}
  , {key:'contact', input:InputText}
  , {key:'paymentterm', input:InputNumber}
  , {key:'phone', input:InputText}
  , {key:'postbox', input:InputText}
  , {key:'zipcode', input:InputText}
  , {key:'zippost', input:InputText}
]

export const Client = withRouter(
  connect(
    state => ({ state, clients: getClients(state) }),
    { storeClient, removeClient, addProject, storeProject }
  )(({ history, match, state, clients, storeClient, removeClient, addProject, storeProject }) => {

    const clientOld = getClient(clients, parseInt(match.params.client, 10))
    const isClient = !!clientOld
    const [client, setClient] = useState(clientOld)
    const newProjectEvents = getNewProjectEvents(clients, clientOld, addProject)
    const [emptyMsg] = useState(()=>[<T>clientNoProjects</T>, ', ', <Link {...newProjectEvents}><T>create one</T></Link>].map(keyMap))

    useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
    if (isClient){
      const isDirty = !isEqual(clientOld, client, ['projects'])
      saveable.dispatch(
          true
          , isDirty && storeClient.bind(null, client) || null
          , isDirty && (() => setClient(clientOld)) || null
          , removeClient.bind(null, clientOld.nr)
      )
    } else {
      history.push('/clients')
    }

    const projectListProjects = clientOld?.projects.map(project => ({
      ...project
      , onClick: () => history.push(getProjectHref(project))
      // todo: make paid click functional
      , paid: <InputCheckbox
          value={project.paid}
          style={{margin:'0.25rem 0 0'}}
          onClick={onClickPaid.bind(null, project, storeProject)}
        />
      , nr: getProjectNumber(project, state)
      , date: getProjectDate(project)
      , dateLatest: getProjectDateLatest(project)
      , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    }))

    const getSetter = key => value =>
        setClient({...client, ...[key, value].reduce((acc, v)=>(acc[key]=v, acc), {})})

    return (
      (isClient && (
        <>
          <h3>{client.name||nbsp}</h3>
          <form>
            {editablePropNames.map(
              ({key, input:Input}, index) =>
                <Label key={index}>
                  <T>{key}</T>
                  <Input value={client[key]} setter={getSetter(key)} />
                </Label>
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
              empty={emptyMsg}
              // empty={[<T key={0}>clientNoProjects</T>, ', ', <Link {...newProjectEvents} key={1}><T key={2}>create one</T></Link>]}
            />
          </section>
        </>
      )) || <p>Client not found</p>
    )
  })
)