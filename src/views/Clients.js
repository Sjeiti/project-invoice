import React, {useState} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getClients, getClientHref } from '../model/clients/selectors'
import { addClient } from '../model/clients/actions'
import {Input} from '../components/Input'
import {Label} from '../components/Label'
import {ButtonLink} from '../components/ButtonLink'
import {AnchorButton} from '../components/AnchorButton'
import {getNewClientEvents} from '../model/eventFactory'

export const Clients = connect(
  state => ({ clients: getClients(state) }),
  { addClient }
)(({ clients, addClient }) => {
  const [filter, setFilter] = useState('')
  const filteredClients = clients.filter(client=>filter===''||client.name.toLowerCase().includes(filter.toLowerCase()))
  const newClientEvents = getNewClientEvents(clients, addClient)
  return (
    <>
      <ButtonLink {...newClientEvents} className="float-right">new client</ButtonLink>
      <h1>
        clients <small>({clients.length})</small>
      </h1>
      <Label style={{width:'50vw'}}>Filter<Input value={filter} setter={setFilter} /></Label>
      <ol>
        {filteredClients.length&&filteredClients.map((client, index) => (
          <li key={index}>
            <Link to={getClientHref(client)}>{client.name || 'unnamed'}</Link>
          </li>
        ))||<li>
          No clients found:&nbsp;
          {filter
            &&<AnchorButton onClick={()=>setFilter('')}>clear filter</AnchorButton>
            ||<Link {...newClientEvents}>create one</Link>
          }.
        </li>}
      </ol>
    </>
  )
})
