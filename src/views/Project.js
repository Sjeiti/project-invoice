import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, nbsp, getGetSetter} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject} from '../model/clients/actions'
import {getClient, getProject, getClients, getClientHref} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Button} from '../components/Button'
import {Input} from '../components/Input'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {T} from '../components/T'

const editablePropNames = [
    'description'
    , 'hourlyRate'
    , 'discount'
    , 'paid'
    , 'quotationDate'
]

export const Project = withRouter(
  connect(
    state => ({ clients: getClients(state) }),
    { storeProject, removeProject }
  )(
    ({
      history,
      match: {
        params: { client: clientNr, project: projectId }
      },
      storeProject,
      removeProject,
      clients
    }) => {

      const client = getClient(clients, clientNr)
      const projectOld = client && getProject(client.projects, projectId)
      const isProject = !!projectOld

      const [project, setProject] = useState(projectOld)
      const getSetter = getGetSetter(project, setProject)

      useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
      if (isProject){
        const isDirty = !isEqual(projectOld, project)
        saveable.dispatch(
            true
            , isDirty && storeProject.bind(null, project) || null
            , isDirty && (() => setProject(projectOld)) || null
            , removeProject.bind(null, projectOld.id)
        )
      } else {
        history.push((client && getClientHref(client)) || '/clients')
      }

      const addLine = ()=>project.lines.push({
          description:''
          , hours: 0
          , amount: 0
          , vat: 0 // todo: default amount
        })
      const projectLineCols = [
        {key:'drag', th: ''}
        , {key:'description', th:<T>description</T>}
        , {key:'hours', th:<T>hours</T>}
        , {key:'times', th:''}
        , {key:'vat', th:<T>vat</T>}
        , {key:'amount', th:<T>amount</T>}
      ]
      const projectLineSubjects = project.lines.map(line => {
        // const {description, hours, amount} = line
        // const setDescription = v=>project.description = v
        // const setHours = v=>project.hours = v
        // const setAmount = v=>project.amount = v
        const [description, setDescription] = useState(line.description)
        const [hours, setHours] = useState(line.hours)
        const [amount, setAmount] = useState(line.amount)
        return {
          drag: <Icon type="drag" />
          , description: <Input value={description} setter={setDescription} />
          , hours: <Input value={hours} setter={setHours} />
          , times: hours*project.hourlyRate
          , vat: ''
          , amount: <Input value={amount} setter={setAmount} />
        }
      })

      return (
        (isProject && (
          <>
            <h3><Link to={getClientHref(client)}>{client.name||nbsp}</Link></h3>

            <h2>{project.description||nbsp}</h2>

            <section>
              {editablePropNames.map(
                (key, index) =>
                  <Label key={index}>
                    <T>{key}</T>
                    <Input value={project[key]} setter={getSetter(key)} />
                  </Label>
              )}
            </section>

            <section>
              <Button onClick={addLine} className="float-right"><T>new line</T></Button>
              <h3><T>lines</T></h3>
              <Table
                  cols={projectLineCols}
                  subjects={projectLineSubjects}
              />
            </section>
          </>
        )) || <p><T>project not found</T></p>
      )
    }
  )
)
