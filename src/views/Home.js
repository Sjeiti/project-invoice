import React,{useState} from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {CSSTransition} from 'react-transition-group'
import {absolute, clearfix, size} from '../service/css'
import {getConfig} from '../model/config/selectors'
import {storeConfig} from '../model/config/actions'
import {
  getOpenProjects
  , getClients
  , getLatestClient
  , getLatestProject
  , getProjectHref
  , getTotalIncDiscounted
  , getDraftProjects
  , getClient
} from '../model/clients/selectors'
import {addClient, addProject, storeProject} from '../model/clients/actions'
import {getNewClientEvents, getNewProjectEvents} from '../model/eventFactory'
import {Logo} from '../components/Logo'
import {AnchorButton} from '../components/AnchorButton'
import {ButtonLink} from '../components/ButtonLink'
import {Button} from '../components/Button'
import {Price} from '../components/Price'
import {Table} from '../components/Table'
import {T} from '../components/T'
import {InputCheckbox, InputText} from '../components/Input'
import {onClickPaid} from '../model/clients/util'

const bgcolor = '#3f5267'
const Jumbotron = styled.div`
    display: block;
    position: relative;
    top:  -${size.padding};
    padding-bottom: 1rem;
    margin-bottom: 40px;
    font-size: 2rem;
    line-height: 130%;
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 100vw;
      height: 100%;
      z-index: -1;
      transform: translateX(-50%);
      background-position: center;
      background-size: cover;
      background-color: #0cbaba;
      background-image: linear-gradient(315deg, #0cbaba 0%, ${bgcolor} 100%);
    }
    ${clearfix}
    &-enter, &-leave-to {
      transition: transform 300ms linear, margin-bottom 300ms linear;
      transform: translateY(-100%);
      margin-bottom: -220px;
    }
    &, * { color: white; }
    svg {
      z-index: 1;
    }
    p, button, a {
      position: relative;
      z-index: 2;
    }
    p {
      padding: 40px;
    }
    button, a {
      font-size: 12px;
      line-height: 130%;
    }
    &.jumbotron-exit {
      margin: 0 0 1rem;
    }
    &.jumbotron-exit-active {
      margin: -15.5rem 0 1rem;
      transition: margin-top 500ms ease;
    }
`

export const Home = withRouter(connect(
  state => ({ clients: getClients(state), config: getConfig(state) }),
  { addClient, addProject, storeProject, storeConfig }
)(({history, clients, config, addClient, addProject, storeProject, storeConfig}) => {
  // const [clients, setClients] = useState(clientsOld)
  const latestClient = getLatestClient(clients)
  const latestProject = getLatestProject(clients)
  const openInvoices = getOpenProjects(clients).map(project => ({
    ...project
    , paid: <InputCheckbox
      value={project.paid}
      style={{margin:'0.25rem 0 0'}}
      onClick={onClickPaid.bind(null, project, storeProject)}
    />
    , date: project.invoices.slice(0).pop().date
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    , actions: 'todo' // todo
    , key: project.id
  }))

  const draftProjects = getDraftProjects(clients).map(project => ({
    ...project
    , clientName: getClient(clients, project.clientNr).name
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    , actions: 'todo' // todo
  }))
  const hideHomeMessage = storeConfig.bind(null, {...config, ...{homeMessage:false}})
  return <div>
    <CSSTransition
        classNames="jumbotron"
        timeout={500}
        in={config.homeMessage}
        unmountOnExit
    >
      <Jumbotron data-v-if="config.homeMessage" data-kkey="'jumbotron'">
        <p data-v-_="'homeMessage'">This invoicing application stores all your data on your local machine.<br/>
        <em><small data-v-_="'homeMessageSub'">Because all your data are belong to you.</small></em></p>
        <AnchorButton className="float-right" onClick={hideHomeMessage}>hide message</AnchorButton>{/* todo */}
        <Link to={'/about'} className="float-right" style={{marginRight:'1rem'}}>read more</Link>
        <Logo size="256" colors={['#3B596D', '#376677', '#2A7F8B']} style={absolute(-3, -4)} />
      </Jumbotron>
    </CSSTransition>
    <div className="row no-gutters">
      <section className="col-12 col-md-5">
        <h2><T>whatDoYouWantToDo</T></h2>
        <p><ButtonLink {...getNewClientEvents(clients, addClient)}><T>createANewClient</T></ButtonLink></p>
        {latestClient&&<p><ButtonLink {...getNewProjectEvents(clients, latestClient, addProject)}>Create project for <span>'{latestClient.name}'</span></ButtonLink></p>}
        {latestProject&&<p><Button data-click="onCloneLatestProject">Clone project <span>'{latestProject.description}'</span></Button></p>}
        <p><ButtonLink to="/overview/quarter"><T>seeCurrentQuarter</T></ButtonLink></p>
      </section>
      <section className="col-12 col-md-7">
        <h2><T>Open invoices</T></h2>
        <Table
              cols="paid date description totalIncDiscounted actions"
              subjects={openInvoices}
              sort="date" // todo
              asc="false" // todo
            ttotals="false" // todo
            aanimate="true" // todo
              empty={<T>youCurrentlyHaveNoOpenInvoices</T>}
            />
      </section>
      <section className="col-12 col-md-7">
        <h2><T>Draft projects</T></h2>
        <Table
              cols="clientName description totalIncDiscounted actions"
              subjects={draftProjects}
              sort="date" // todo
              asc="false" // todo
            ttotals="false" // todo
              empty={<T>youCurrentlyHaveNoDrafts</T>}
            />
      </section>
    </div>
  </div>
}))