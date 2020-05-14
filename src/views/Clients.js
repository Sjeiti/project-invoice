import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {
  getClients, getClientHref, getLatestProject, getProjectDate, getProjectNumber, getProjectHref
} from '../model/clients/selectors'
import {addClient} from '../model/clients/actions'
import {InputText} from '../components/Input'
import {ButtonLink} from '../components/ButtonLink'
import {AnchorButton} from '../components/AnchorButton'
import {getNewClientEvents} from '../model/eventFactory'
import {Table} from '../components/Table'
import {T} from '../components/T'
import {Icon} from '../components/Icon'
import {keyMap} from '../util'

export const Clients = connect(
  state => ({
    clients: getClients(state)
    , state
  }),
  { addClient }
)(({ clients, addClient, state }) => {
  const {t} = useTranslation()
  const [filter, setFilter] = useState('')
  const filteredClients = clients.filter(client=>filter===''||client.name.toLowerCase().includes(filter.toLowerCase()))
      .map(client => {
        const latestProject = getLatestProject([client])
        const allPaid = client.projects
            .filter(p=>p.invoices.length)
            .reduce((acc, {paid})=>acc&&paid, true)
        return {...client, ...{
          invoices: client.projects.length
          , name: <Link to={getClientHref(client)}>{client.name || 'unnamed'}</Link>
          , recent: latestProject&&getProjectDate(latestProject)||'-'
          , last: latestProject&&<Link to={getProjectHref(latestProject)}>{getProjectNumber(latestProject, state)}</Link>||'-'
          , allPaid: <Icon type={allPaid&&'mark'||'close'} style={{color:allPaid&&'var(--color-gray)'||'var(--color-red)'}}></Icon>
        }}
      })
  const newClientEvents = getNewClientEvents(clients, addClient)
  const cols = 'nr name invoices recent last allPaid'.split(' ').map(key=>({key, th:t(key)}))
  cols[1].th = <>
    <T>name</T>
    <InputText
      placeholder={t('filter')}
      value={filter}
      setter={setFilter}
      style={{display:'inline-block', margin:'0 0 0 1rem', padding:'0.125rem 0.5rem'}}
    />
  </>
  return (
    <>
      <div className="clearfix">
        <ButtonLink className="float-right" {...newClientEvents} data-cy="newClient"><T>new client</T></ButtonLink>
        <h1 className="float-left margin-top-0" data-cy="heading">
          <T>clients</T> <small>({clients.length})</small>
        </h1>
      </div>
      <Table
        cols={cols}
        subjects={filteredClients}
        empty={[t('No clients found')+': ', filter
            &&<AnchorButton onClick={()=>setFilter('')}><T>clear filter</T></AnchorButton>
            ||<Link {...newClientEvents}><T>create one</T></Link>
        ].map(keyMap)}
        data-cy="clientList"
      />
    </>
  )
})
