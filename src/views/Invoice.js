import React, {useState, createRef} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {getClient, getProject, getClients, getProjectNumber, getProjectHref} from '../model/clients/selectors'
import {getConfig} from '../model/config/selectors'
import {PrintInvoice} from '../components/PrintInvoice'
import {Button} from '../components/Button'
import {T} from '../components/T'

export const Invoice = withRouter(
  connect(
    state => ({ state, clients: getClients(state), config:getConfig(state) })
  )(
    ({
      history
      , match: {
        params: { client: clientNr, project: projectId, reminder:reminderIndex }
        , url
      }
      , state
      , clients
      , config
    }) => {
      const client = getClient(clients, clientNr)
      const project = client && getProject(client.projects, projectId)

      const isQuotation = /quotation$/.test(url)
      const invoiceIndex = reminderIndex||isQuotation&&-1||0

      const [lang, setLang] = useState(config.lang)

      const piRef = createRef()
      function onClickPrint(){
        piRef.current.printInvoice()
      }

      return <section>
        <header>
          <div className="float-right">
            {config.langs.map(iso=><Button key={iso} onClick={()=>setLang(iso)} disabled={iso===lang}>{iso}</Button>)}
          </div>
          <h1><span className="hide-low"><T>invoice</T> </span><Link to={getProjectHref(project)}>{getProjectNumber(project, state)}</Link></h1>
          {/*<div className="invoice-options">*/}
            <Button onClick={onClickPrint} style={{margin:'0 auto'}}><T>print</T></Button>
          {/*</div>*/}
        </header>
        <PrintInvoice
          ref={piRef}
          state={state}
          client={client}
          project={project}
          invoiceIndex={invoiceIndex}
          lang={lang}
        />
        {/*<print-invoice ref="invoice" client="client" project="project" invoice="invoice" />*/}
      </section>
    }
  )
)
