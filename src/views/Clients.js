import React, {useState} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  getClients,getClientHref,getLatestProject,getProjectDate,getProjectNumber,getProjectHref
} from '../model/clients/selectors'
import { addClient } from '../model/clients/actions'
import {Input} from '../components/Input'
import {Label} from '../components/Label'
import {ButtonLink} from '../components/ButtonLink'
import {AnchorButton} from '../components/AnchorButton'
import {getNewClientEvents} from '../model/eventFactory'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {color} from '../cssService'

const {colorGray, colorRed} = color

export const Clients = connect(
  state => ({
    clients: getClients(state)
    , state // : cloneDeep(state)
  }),
  { addClient }
)(({ clients, addClient, state }) => {
  const [filter, setFilter] = useState('')
  const filteredClients = clients.filter(client=>filter===''||client.name.toLowerCase().includes(filter.toLowerCase()))
      .map(client => {
        const latestProject = getLatestProject([client])
        const allPaid = client.projects
            .filter(p=>p.invoices.length)
            .reduce((acc,{paid})=>acc&&paid, true)
        return {...client, ...{
          invoices: client.projects.length
          , name: <Link to={getClientHref(client)}>{client.name || 'unnamed'}</Link>
          , recent: latestProject&&getProjectDate(latestProject)||'-'
          , last: latestProject&&<Link to={getProjectHref(latestProject)}>{getProjectNumber(latestProject, state)}</Link>||'-'
          , allPaid: <Icon type={allPaid&&'mark'||'close'} style={{color:allPaid&&colorGray||colorRed}}></Icon>
        }}
      })
  const newClientEvents = getNewClientEvents(clients, addClient)
  return (
    <>
      <ButtonLink {...newClientEvents} className="float-right">new client</ButtonLink>
      <h1>
        clients <small>({clients.length})</small>
      </h1>
      <Label style={{width:'50vw'}}>Filter<Input value={filter} setter={setFilter} /></Label>
      <Table
        cols="nr name invoices recent last allPaid"
        projects={filteredClients}
        empty={['No clients found: ', filter
            &&<AnchorButton onClick={()=>setFilter('')}>clear filter</AnchorButton>
            ||<Link {...newClientEvents}>create one</Link>
]}
      />
    </>
  )
})
