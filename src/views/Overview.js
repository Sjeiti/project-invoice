import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {T} from '../components/T'
import {
  getClient,
  getClients,
  getDraftProjects,
  getProjectHref,
  getTotalIncDiscounted,
  getProjectsYears,
  getProjectsOfYearQuarter,
  getProjectNumber,
  getProjectDate,getProjectDateLatest
} from '../model/clients/selectors'
import {addClient,storeProject} from '../model/clients/actions'
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
`

export const Overview = withRouter(connect(
  state => ({
    clients: getClients(state)
    , state
  }),
  { storeProject }
)(({ history, match, clients, storeProject, state }) => {

  const [years] = useState(getProjectsYears(clients))
  // const [year] = useState(match.params.year||years[years.length-1])
  const year = match.params.year||years[years.length-1]

  const quarterProjects = [0,0,0,0].map((n,i)=>getProjectsOfYearQuarter(clients, year, i).map(project => ({
    ...project
    , paid: <InputCheckbox
        value={project.paid}
        style={{margin:'0.25rem 0 0'}}
        onClick={onClickPaid.bind(null, project, storeProject)}
      />
    , clientName: getClient(clients, project.clientNr).name
    , onClick: () => history.push(getProjectHref(project))
    , nr: getProjectNumber(project, state)
    , date: getProjectDate(project)
    , dateLatest: getProjectDateLatest(project)
    , totalIncDiscounted: <Price symbol="€" amount={getTotalIncDiscounted(project)} separator="," />
  })))

  return <StyledOverview>
    <h3><T>overview</T></h3>
    {years.map(yearLink => <Link to={`/overview/${yearLink}`} className={year===yearLink&&'current'}>{yearLink}</Link>)}

    {quarterProjects.map((quarterProject,i)=><>
      <h3>{i+1}e <T>quarter</T></h3>
      <Table
        cols="paid nr date dateLatest description totalIncDiscounted"
        subjects={quarterProject}
        sort="date" // todo
        asc="false" // todo
        totals="true" // todo
        key={`quarter${i}`} // todo
      >
        <tfoot>
          <tr>
            <td colspan="5" />
            <td><Price amount={quarterProject.map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
          </tr>
        </tfoot>
      </Table>
    </>)}

    {}
    <table>
      <tfoot>
        <tr>
          <td colspan="5" />
          <td><Price amount={quarterProjects.reduce((acc, a)=>(acc.push(...a), acc), []).map(project=>project.lines.reduce((acc, {amount}) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0)} /></td>
        </tr>
      </tfoot>
    </table>

  </StyledOverview>
}))
