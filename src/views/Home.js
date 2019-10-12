import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {absolute, clearfix} from '../cssService'
import {
  getOpenProjects,
  getClients,
  getLatestClient,
  getLatestProject,
  getProjectHref,
  getTotalIncDiscounted,
  getDraftProjects,getClient
} from '../model/clients/selectors'
import {addClient, addProject} from '../model/clients/actions'
import {getNewClientEvents, getNewProjectEvents} from '../model/eventFactory'
import {Logo} from '../components/Logo'
import {AnchorButton} from '../components/AnchorButton'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {Button} from '../components/Button'
import {Price} from '../components/Price'
import {ProjectList} from '../components/ProjectList'
import {Input} from '../components/Input'

const bgcolor = '#3f5267'
const Jumbotron = styled.div`
    display: block;
    position: relative;
    //top: - var(--padding);
    //overflow: hidden;
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
`
//className="page-home"
export const Home = withRouter(connect(
  state => ({ clients: getClients(state) }),
  { addClient, addProject }
)(({history, clients, addClient, addProject}) => {
  const latestClient = getLatestClient(clients)
  const latestProject = getLatestProject(clients)
  const openInvoices = getOpenProjects(clients).map(project => ({
    ...project
    , paid: <Input value={project.paid} />
    , date: project.invoices.slice(0).pop().date
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    ,actions: 'todo' // todo
  }))
  const draftProjects = getDraftProjects(clients).map(project => ({
    ...project
    , clientName: getClient(clients, project.clientNr).name
    , onClick: () => history.push(getProjectHref(project))
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    ,actions: 'todo' // todo
  }))
  return <div>
    <Jumbotron data-v-if="config.homeMessage" data-kkey="'jumbotron'">
      <p data-v-_="'homeMessage'">This invoicing application stores all your data on your local machine.<br/>
      <em><small data-v-_="'homeMessageSub'">Because all your data are belong to you.</small></em></p>
      <AnchorButton className="float-right" data-v-oncclick="onHideWelcome">hide message</AnchorButton>{/* todo */}
      <Link to={'/about'} className="float-right" style={{marginRight:'1rem'}}>read more</Link>
      <Logo size="256" colors={['#3B596D', '#376677', '#2A7F8B']} style={absolute(-3, -4)} />
    </Jumbotron>
    <div className="row no-gutters">
      <section className="col-12 col-md-5">
        <h2>What do you want to do:</h2>
        <p><ButtonAnchor {...getNewClientEvents(clients, addClient)}>New client</ButtonAnchor></p>
        {latestClient&&<p><ButtonAnchor {...getNewProjectEvents(clients, latestClient, addProject)}>Create project for <span>'{latestClient.name}'</span></ButtonAnchor></p>}
        {latestProject&&<p><Button data-click="onCloneLatestProject">Clone project <span>'{latestProject.description}'</span></Button></p>}
        <p><ButtonAnchor to="/overview/quarter">See current quarter</ButtonAnchor></p>
      </section>
      <section className="col-12 col-md-7">
        <h2>Open invoices</h2>
        <ProjectList
            pprojects="invoices"
              cols="paid date description totalIncDiscounted actions"
              projects={openInvoices}
              sort="date" // todo
              asc="false" // todo
            ttotals="false"
            aanimate="true"
              empty="There are no open invoices :-)"
            />
      </section>
      <section className="col-12 col-md-7">
        <h2>Draft projects</h2>
        <ProjectList
            pprojects="drafts"
              cols="clientName description totalIncDiscounted actions"
              projects={draftProjects}
              sort="date" // todo
              asc="false" // todo
            ttotals="false"
              empty="You currently have no drafts... :-/"
            />
      </section>
    </div>
  </div>
}))

