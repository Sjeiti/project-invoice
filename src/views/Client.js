import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
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
import {storeClient, removeClient, addProject} from '../model/clients/actions'
import {saveable} from '../saveable'
import {Label} from '../components/Label'
import {ButtonLink} from '../components/ButtonLink'
import {Price} from '../components/Price'
import {Table} from '../components/Table'
import {InputCheckbox, InputText, InputNumber} from '../components/Input'
import {T} from '../components/T'

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
    state => ({ clients: getClients(state) }),
    { storeClient, removeClient, addProject }
  )(({ history, match, clients, storeClient, removeClient, addProject }) => {

    const clientOld = getClient(clients, parseInt(match.params.client, 10))
    const isClient = !!clientOld
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
      , paid: <InputCheckbox value={project.paid} style={{margin:'0.25rem 0 0'}} />
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
              empty={[<T>clientNoProjects</T>, ', ', <Link {...newProjectEvents} key={0}><T>create one</T></Link>]}
            />
          </section>
        </>
      )) || <p>Client not found</p>
    )
  })
)
