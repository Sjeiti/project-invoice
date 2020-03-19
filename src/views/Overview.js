import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
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
import {Table} from '../components/Table'
import {Price} from '../components/Price'
import styled from 'styled-components'
import {InputCheckbox} from '../components/Input'
import {onClickPaid} from '../model/clients/util'


const StyledOverview =  styled.section`
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
)(({ history, match, clients, storeProject, state }) => {

  const [years] = useState(getProjectsYears(clients))
  const year = match.params.year||years[years.length-1]

  const quarterProjects = [0,0,0,0].map((n,i)=>getProjectsOfYearQuarter(clients, year, i).map(project => ({
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
  })))

  return <StyledOverview>
    <h3><T>overview</T></h3>
    {years.map(yearLink => <Link key={yearLink} to={`/overview/${yearLink}`} className={year===yearLink&&'current'||''}>{yearLink}</Link>)}

    {quarterProjects.map((quarterProject,i)=><div key={i}>
      <h3>{i+1}e <T>quarter</T></h3>
      <Table
        cols="paid nr date client description totalDiscounted totalVATDiscounted totalIncDiscounted"
        subjects={quarterProject}
        key={`quarter${i}`}
      >

        {i===3&&<tfoot className="total"><tr><td colSpan="8" /></tr><tr><td colSpan="7" />
            <td><Price amount={quarterProjects.reduce((acc, a)=>(acc.push(...a), acc), []).map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
        </tr></tfoot>}

        <tfoot>
          <tr>
            <td colSpan="7" />
            <td><Price amount={quarterProject.map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
          </tr>
        </tfoot>
      </Table>
    </div>)}

  </StyledOverview>
}))
