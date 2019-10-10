import React, {useState} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getClients, getClientHref } from '../model/clients/selectors'
import { addClient } from '../model/clients/actions'
import { getNextClientNr } from '../model/clients/selectors'
import {Input} from '../components/Input'
import {Label} from '../components/Label'
import {AnchorButton} from '../components/AnchorButton'

export const Clients = connect(
  state => ({ clients: getClients(state) }),
  { addClient }
)(({ clients, addClient }) => {
  const newClientNr = getNextClientNr(clients)
  const newClientHref = getClientHref({ nr: newClientNr })
  const [filter, setFilter] = useState('')
  const filteredClients = clients.filter(client=>filter===''||client.name.toLowerCase().includes(filter.toLowerCase()))
  const addNewClient = addClient.bind(null, newClientNr)
  return (
    <>
      <Link to={newClientHref} onClick={addNewClient} className="btn float-right">
        new client
      </Link>
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
            ||<AnchorButton onClick={addNewClient}>create one</AnchorButton>
          }.
        </li>}
      </ol>
    </>
  )
})
