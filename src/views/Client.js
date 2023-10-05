import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {capitalise,isEqual,keyMap,nbsp} from '../util'
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
import {LineEllipsed} from '../components/LineEllipsed'
import {DirtyPrompt} from '../components/DirtyPrompt'
import {withRouter} from '../util/withRouter'
import {Page} from '../components/Page'
import i18next from 'i18next'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'

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
    state => ({ state, clients: getClients(state), session: getSession(state) }),
    { storeClient, removeClient, addProject, storeProject, storeSession }
  )(({ state, clients, storeClient, removeClient, addProject, storeProject, storeSession }) => {

    const params = useParams()

    const clientOld = getClient(clients, parseInt(params?.client, 10))
    const isClient = !!clientOld
    const [client, setClient] = useState(clientOld)
    const newProjectEvents = getNewProjectEvents(clients, clientOld, addProject)
    const [emptyMsg] = useState(()=>[<T>clientNoProjects</T>, ', ', <Link {...newProjectEvents}><T>create one</T></Link>].map(keyMap))

    const navigate = useNavigate()

    // useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
    const isDirty = isClient&&!isEqual(clientOld, client, ['projects'])
    console.log('isDirty',isDirty) // todo: remove log
    useEffect(()=>{
      storeSession({
        saveable: true
        , save: isDirty && storeClient.bind(null, client) || null
        , revert: isDirty && (() => setClient(clientOld)) || null
        , deleet: removeClient.bind(null, clientOld.nr)
      })
      console.log('useLocationEffect saveable',true) // todo: remove log
    }, [isDirty, storeSession])
    if (isClient){
      // console.log('isDirty',isDirty) // todo: remove log
      // saveable.dispatch(
      //     true
      //     , isDirty && storeClient.bind(null, client) || null
      //     , isDirty && (() => setClient(clientOld)) || null
      //     , removeClient.bind(null, clientOld.nr)
      // )
    } else {
      navigate('/clients')
    }

    const projectListProjects = clientOld?.projects.map(project => ({
      ...project
      , description: <LineEllipsed>{project.description}</LineEllipsed>
      , onClick: () => navigate(getProjectHref(project))
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

    return <Page saveable>
      {(isClient && (
        <>
          <h3 data-cy="clientNameTitle">{client.name||nbsp}</h3>
          <form>
            {editablePropNames.map(
              ({key, input:Input}, index) =>
                <Label key={index}>
                  <T>{key}</T>
                  <Input value={client[key]} setter={getSetter(key)} data-cy={`client${capitalise(key)}`} />
                </Label>
            )}
          </form>
          <hr/>
          <section>
            <ButtonLink {...newProjectEvents} className="float-right" data-cy="newProject"><T>new project</T></ButtonLink>
            <h3><T>projects</T></h3>
            <Table
              cols="paid nr date dateLatest description totalIncDiscounted"
              subjects={projectListProjects}
              sort="date" // todo
              asc="false" // todo
              empty={emptyMsg}
              data-cy="clientProjects"
            />
          </section>
          <DirtyPrompt when={isDirty} />
        </>
      )) || <p>Client not found</p>}
    </Page>
  })
)
