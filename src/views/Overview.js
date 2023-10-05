import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {Link,useParams} from 'react-router-dom'
import {T} from '../components/T'
import {
  getClient,
  getClients,
  getProjectHref,
  getTotalIncDiscounted,
  getTotalDiscounted,
  getTotalVATDiscounted,
  getProjectsYears,
  getProjectsOfYearQuarter,
  getProjectNumber,
  getProjectDate,
  getProjectDateLatest
} from '../model/clients/selectors'
import {storeProject} from '../model/clients/actions'
import {Button} from '../components/Button'
import {Table} from '../components/Table'
import {Price} from '../components/Price'
import styled from 'styled-components'
import {InputCheckbox} from '../components/Input'
import {onClickPaid} from '../model/clients/util'
import {appendChild, currency, interpolateEvil} from '../util'
import {project as enhanceProject} from '../model/clients/project'
import {CURRENCY_ISO} from '../config/currencyISO'
import {withRouter} from '../util/withRouter'

const {body} = document

const StyledOverview =  styled.section`
  nav {
    margin-bottom: 2rem;
  }
  a{
    &.current {
      font-weight: bold;
    }
    +a {
      margin-left: 0.5rem;
    }
  }
  table tfoot.total {
    background-color: transparent;
    font-weight: bold;
    tr:first-child td {
      background-color: transparent;
    }
    tr:last-child td {
      background-color: #DDD;
    }
  }
`

export const Overview = withRouter(connect(
  state => ({
    clients: getClients(state)
    , state
  }),
  { storeProject }
)(({ history, clients, storeProject, state }) => {

  const params = useParams()

  const [years] = useState(getProjectsYears(clients))
  const year = params?.year||years[years.length-1]
  const {config:{csvTemplate, currency:_currency}, personal:data} = state

  const quarterProjects = [0, 0, 0, 0].map((n, i)=>getProjectsOfYearQuarter(clients, year, i).map((project, j) => ({
    ...project
    , paid: <InputCheckbox
        value={project.paid}
        style={{margin:'0.25rem 0 0'}}
        onClick={onClickPaid.bind(null, project, storeProject)}
      />
    , client: getClient(clients, project.clientNr).name
    , onClick: () => history.push(getProjectHref(project))
    , nr: getProjectNumber(project, state)
    , date: getProjectDate(project)
    , dateLatest: getProjectDateLatest(project)
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
    , totalDiscounted: <Price symbol="€" amount={getTotalDiscounted(project)} separator="," />
    , totalVATDiscounted: <Price symbol="€" amount={getTotalVATDiscounted(project)} separator="," />
    , project
    , key: `q${i}p${j}`
  })))

  const [elmCsv] = useState(appendChild('textarea', body, 'visually-hidden'))
  // useEffect(()=>body.removeChild.bind(body, elmCsv), [])
  useEffect(()=>elmCsv.remove.bind(elmCsv), [])
  function onClickCSVButton(quarter){
    const parsed = quarter.map(prj=>{
      const {clientNr, invoices: [invoice]} = prj
      const client = getClient(clients, clientNr)
      const project = enhanceProject(prj.project, {_client:client, model:state}) // prj
      const {symbol} = CURRENCY_ISO[_currency]
      const boundCurrency = f=>currency(f, symbol+' ', 2, '.', ',')
      return interpolateEvil(csvTemplate, {
        client
        , project
        , invoice
        , data
        , currency: boundCurrency
      })
    })
    elmCsv.value = parsed.join('\n')
    if (elmCsv && elmCsv.select){
      elmCsv.select()
      try {
        document.execCommand('copy')
        elmCsv.blur()
      } catch (err){
        alert('please press Ctrl/Cmd+C to copy')
      }
    }
  }

  return <StyledOverview>
    <h3><T>overview</T></h3>

    <nav data-cy="years">
      {years.map(yearLink => <Link key={yearLink} to={`/overview/${yearLink}`} className={year===yearLink&&'current'||''}>{yearLink}</Link>)}
    </nav>

    {quarterProjects.map((quarterProject, i)=><div key={i} data-cy="quarter">
      {i>0&&<hr />}
      <header className="display-flex">
        <h3><T>quarter</T> {i + 1}</h3>
        <Button disabled={quarterProject.length===0} onClick={onClickCSVButton.bind(null, quarterProject)}><T>copyCsvData</T></Button>
      </header>
      <Table
        cols="paid nr date client description totalDiscounted totalVATDiscounted totalIncDiscounted"
        subjects={quarterProject}
        key={`quarter${i}`}
      >

        {i===3&&<tfoot className="total"><tr><td colSpan="8" /></tr><tr>
            <td colSpan="5" />
            <td><Price amount={quarterProjects.reduce((acc, a)=>(acc.push(...a), acc), []).map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
            <td><Price amount={quarterProjects.reduce((acc, a)=>(acc.push(...a), acc), []).map(project=>project.lines.reduce((acc, {amount, vat}) => acc + amount*(vat/100), 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
            <td><Price amount={quarterProjects.reduce((acc, a)=>(acc.push(...a), acc), []).map(project=>project.lines.reduce((acc, {amount, vat}) => acc + amount + amount*(vat/100), 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
        </tr></tfoot>}

        <tfoot>
          <tr>
            <td colSpan="5" />
            <td><Price amount={quarterProject.map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
            <td><Price amount={quarterProject.map(project=>project.lines.reduce((acc, {amount, vat}) => acc + amount*(vat/100), 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
            <td><Price amount={quarterProject.map(project=>project.lines.reduce((acc, {amount, vat}) => acc + amount + amount*(vat/100), 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
          </tr>
        </tfoot>
      </Table>
    </div>)}

  </StyledOverview>
}))
