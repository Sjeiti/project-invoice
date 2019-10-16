import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, cloneDeep} from 'lodash'
import {nbsp, getGetSetter} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject} from '../model/clients/actions'
import {getClient, getProject, getClients, getClientHref} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Button} from '../components/Button'
import {Input} from '../components/Input'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {Price} from '../components/Price'
import {Select} from '../components/Select'
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

      const {hourlyRate, lines} = project

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

      const addLine = ()=>{
        const p = cloneDeep(project)
        p.lines.push({
          description:''
          , hours: 0
          , amount: 0
          , vat: 0
        })
        setProject(p)
      }
      const projectLineCols = [
        {key:'drag'}
        , {key:'description', th:<T>description</T>}
        , {key:'hours', th:<T>hours</T>, tf: lines.reduce((acc, {hours})=>acc+hours, 0)}
        , {key:'times', th:'⇥', tf: <Price amount={lines.reduce((acc, {hours})=>acc+hours*hourlyRate, 0)} />}
        , {key:'amount', th:<T>amount</T>, tf: <Price amount={lines.reduce((acc, {amount})=>acc+amount, 0)} />}
        , {key:'vat', th:<T>vat</T>}
        , {key:'action'}
      ]
      const getLineSetter = index => (key, format) => value => {
        const p = cloneDeep(project)
        p.lines[index][key] = format?format(value):value
        setProject(p)
      }
      const vatOptions = [0, 9, 21].map(value=>({value, text:value}))
      const projectLineSubjects = lines.map((line, index) => {
        const {description, hours, amount, vat} = line
        const lineSetter = getLineSetter(index)
        const amountSetter = lineSetter('amount', parseFloat)
        return {
          drag: <Icon type="drag" />
          , description: <Input value={description} setter={lineSetter('description')} />
          , hours: <Input value={hours} setter={lineSetter('hours', parseFloat)} />
          , times: <Price amount={hours*hourlyRate} onClick={amountSetter.bind(null, hours*hourlyRate)} />
          , amount: <Input value={amount} setter={amountSetter} />
          , vat: <Select value={vat} options={vatOptions} setter={lineSetter('vat', parseFloat)} />
          , action: <Button onClick={()=>{
            const p = cloneDeep(project)
            p.lines.splice(index, 1)
            setProject(p)
          }}><Icon type="close" /></Button>
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
