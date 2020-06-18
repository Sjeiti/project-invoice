import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {CSSTransition} from 'react-transition-group'
import {absolute, clearfix} from '../service/css'
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
  , getInvoiceDaysLate
  , getReminderDaysLate
} from '../model/clients/selectors'
import {addClient, addProject, cloneProject, storeProject} from '../model/clients/actions'
import {getCloneProjectEvents, getNewClientEvents, getNewProjectEvents} from '../model/eventFactory'
import {Logo} from '../components/Logo'
import {AnchorButton} from '../components/AnchorButton'
import {ButtonLink} from '../components/ButtonLink'
import {Button} from '../components/Button'
import {Price} from '../components/Price'
import {Table} from '../components/Table'
import {T} from '../components/T'
import {InputCheckbox} from '../components/Input'
import {onClickInvoice, onClickPaid, onClickRemind} from '../model/clients/util'
import {getData} from '../model/personal/selectors'
import {LineEllipsed} from '../components/LineEllipsed'
import piglet from '../../public/static/img/piglet.svg'
import pigletSleeping from '../../public/static/img/pigletSleeping.svg'
import pigletHappy from '../../public/static/img/pigletHappy.svg'

const bgcolor = '#3f5267'
const Jumbotron = styled.div`
    display: block;
    position: relative;
    top:  -1rem;
    padding-bottom: 1rem;
    margin-bottom: 40px;
    font-size: 2rem;
    line-height: 130%;
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      //width: 100vw;
      width: calc(100vw - 1rem); // them bloody scrollbars (hence the box-shadow)
      height: 100%;
      z-index: -1;
      transform: translateX(-50%);
      background-position: center;
      background-size: cover;
      background-color: #0cbaba;
      background-image: linear-gradient(315deg, #0cbaba 0%, ${bgcolor} 100%);
      box-shadow: -4rem 0 0 ${bgcolor}, 4rem 0 0 #0cbaba;
    }
    ${clearfix}
    &-enter, &-leave-to {
      transition: transform 300ms linear, margin-bottom 300ms linear;
      transform: translateY(-100%);
      margin-bottom: -220px;
    }
    &, * { color: var(--color-header-foreground); }
    svg {
      z-index: 1;
    }
    p, button, a {
      position: relative;
      z-index: 2;
    }
    p {
      &:nth-child(1) {
        padding: 2.5rem 2.5rem 0;
      }
      &:nth-child(2) {
        padding: 1rem 2.5rem 1rem;
        font-size: 1.5rem;
        font-style: italic;
        line-height: 110%;
      }
    }
    button, a {
      font-size: 12px;
      line-height: 130%;
    }
    small {
      line-height: 100%;
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
  state => ({ clients: getClients(state), config: getConfig(state), data: getData(state) }),
  { addClient, addProject, cloneProject, storeProject, storeConfig }
)(({history, clients, config, data, addClient, addProject, cloneProject, storeProject, storeConfig}) => {
  // const [clients, setClients] = useState(clientsOld)
  const latestClient = getLatestClient(clients)
  const latestProject = getLatestProject(clients)
  const openInvoices = getOpenProjects(clients).map(project => ({
    ...project
    , description: <LineEllipsed>{project.description}</LineEllipsed>
    , paid: <InputCheckbox
      value={project.paid}
      style={{margin:'0.25rem 0 0'}}
      onClick={onClickPaid.bind(null, project, storeProject)}
    />
    , date: project.invoices.slice(0).shift().date
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    , actions: (()=>{
      // const daysElapsed = getInvoiceDaysElapsed(project)
      // const daysElapsed1 = getInvoiceDaysElapsed(project, false)
      const hasReminder = project.invoices.length>1
      const daysLate = getInvoiceDaysLate(project, clients)
      const daysLateReminder = getReminderDaysLate(project, data.reminderPeriod)
      const showButton = hasReminder&&daysLateReminder||!hasReminder&&daysLate
      return showButton&&<Button onClick={onClickRemind.bind(null, project, storeProject)}><T>addReminder</T></Button>
    })()
    , key: project.id
  }))

  const draftProjects = getDraftProjects(clients).map(project => ({
    ...project
    , clientName: <LineEllipsed>{getClient(clients, project.clientNr).name}</LineEllipsed>
    , description: <LineEllipsed>{project.description}</LineEllipsed>
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    , actions: <Button onClick={onClickInvoice.bind(null, project, storeProject)}><T>addInvoice</T></Button>
  }))
  const hideHomeMessage = storeConfig.bind(null, {...config, ...{homeMessage:false}})
  return <div>
    <CSSTransition
        classNames="jumbotron"
        timeout={500}
        in={config.homeMessage}
        unmountOnExit
    >
      <Jumbotron data-cy="jumbotron">
        <p><T>homeMessage</T></p>
        <p><T>homeMessageSub</T></p>
        <AnchorButton
            className="float-right"
            onClick={hideHomeMessage}
            data-cy="hideJumbotron"
        ><T>hideMessage</T></AnchorButton>
        <Link to={'/about'} className="float-right" style={{marginRight:'1rem'}}><T>readMore</T></Link>
        <Logo size="256" colors={['#3B596D', '#376677', '#2A7F8B']} style={absolute(-3, -4)} />
      </Jumbotron>
    </CSSTransition>
    <div className="row no-gutters">
      <section className="col-12 col-md-5">
        <h2><T>whatDoYouWantToDo</T></h2>
        <p><ButtonLink {...getNewClientEvents(clients, addClient)} data-cy="newClient"><T>createANewClient</T></ButtonLink></p>
        {latestClient&&<p><ButtonLink {...getNewProjectEvents(clients, latestClient, addProject)} data-cy="newProjectClient"><T>createProjectFor</T> <span>'{latestClient.name}'</span></ButtonLink></p>}
        {latestProject&&<p><ButtonLink {...getCloneProjectEvents(clients, latestProject, cloneProject)} data-cy="cloneProject">Clone project <span>'{latestProject.description}'</span></ButtonLink></p>}
        <p><ButtonLink to="/overview" data-cy="linkQuarter"><T>seeCurrentQuarter</T></ButtonLink></p>
      </section>
      <section className="col-12 col-md-7">
        <h2><T>Open invoices</T></h2>
        <Table
              data-cy="openInvoices"
              cols="paid date description totalIncDiscounted actions"
              subjects={openInvoices}
              sort="date" // todo
              asc="false" // todo
            ttotals="false" // todo
            aanimate="true" // todo
              empty={<><style>svg{'{'}width:25%;height:25%;{'}'}</style><div dangerouslySetInnerHTML={{ __html: pigletHappy }} /><T>youCurrentlyHaveNoOpenInvoices</T></>}
            />
      </section>
      <section className="col-12 col-md-7">
        <h2><T>Draft projects</T></h2>
        <Table
              data-cy="draftProjects"
              cols="clientName description totalIncDiscounted actions"
              subjects={draftProjects}
              sort="date" // todo
              asc="false" // todo
            ttotals="false" // todo
              empty={<><div dangerouslySetInnerHTML={{ __html: pigletSleeping }} /><T>youCurrentlyHaveNoDrafts</T></>}
            />
      </section>
    </div>
  </div>
}))