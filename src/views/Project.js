import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, cloneDeep} from 'lodash'
import {nbsp, getGetSetter} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject} from '../model/clients/actions'
import {getClient, getProject, getClients, getClientHref, getProjectHref, getProjectNumber} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Button, IconButton} from '../components/Button'
import {ButtonLink} from '../components/ButtonLink'
import {InputText, InputNumber, InputCheckbox} from '../components/Input'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {Price} from '../components/Price'
import {Select} from '../components/Select'
import {T} from '../components/T'
import {useTranslation} from 'react-i18next'

const editablePropNames = [
  {key:'description', input:InputText}
    , {key:'hourlyRate', input:InputNumber}
    , {key:'discount', input:InputNumber}
    , {key:'paid', input:InputCheckbox}
    , {key:'quotationDate', input:InputText}
]

const PriceRight = props => <Price {...props} className="float-right" />

export const Project = withRouter(
  connect(
    state => ({ state, clients: getClients(state) }),
    { storeProject, removeProject }
  )(
    ({
      history
      , match: {
        params: { client: clientNr, project: projectId }
      }
      , storeProject
      , removeProject
      , state
      , clients
    }) => {
      const {t} = useTranslation()

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
        , {key:'hours', th:<T>hours</T>}
        , {key:'times', th:'⇥'}
        , {key:'amount', th:<T>amount</T>}
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
          , description: <InputText value={description} setter={lineSetter('description')} />
          , hours: <InputNumber value={hours} setter={lineSetter('hours', parseFloat)} />
          , times: <Price amount={hours*hourlyRate} onClick={amountSetter.bind(null, hours*hourlyRate)} />
          , amount: <InputNumber value={amount} setter={amountSetter} />
          , vat: <Select value={vat} options={vatOptions} setter={lineSetter('vat', parseFloat)} />
          , action: <IconButton onClick={()=>{
            const p = cloneDeep(project)
            p.lines.splice(index, 1)
            setProject(p)
          }} type="close" />
        }
      })

      // console.log('project', project) // todo: remove log

      const totalHours = lines.reduce((acc, {hours}) => acc + hours, 0)
      const totalAmount = lines.reduce((acc, {amount}) => acc + amount, 0)
      const totalAmountVAT = lines.reduce((acc, {amount, vat}) => acc + amount*vat, 0)
      const discount = 1 - project.discount/100
      // const vat = 1 - project.vat/100

      return (
        (isProject && (
          <>
            <h3><Link to={getClientHref(client)}>{client.name||nbsp}</Link></h3>

            <h2>{project.description||nbsp}</h2>

            <section>
              {editablePropNames.map(
                ({key, input:Input}, index) =>
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
              >
                <tfoot>
                  <tr>
                    <td />
                    <td><T>totalExVAT</T></td>
                    <td>{totalHours}</td>
                    <td><PriceRight amount={totalHours*hourlyRate} /></td>
                    <td><PriceRight amount={totalAmount} /></td>
                    <td colSpan="2" />
                  </tr>
                  {!!project.discount&&<tr>
                    <td />
                    <td colSpan="2"><T>discount</T> {project.discount}%</td>
                    <td><PriceRight amount={discount*totalHours*hourlyRate} /></td>
                    <td><PriceRight amount={discount*totalAmount} /></td>
                    <td colSpan="2" />
                  </tr>}
                  <tr>
                    <td />
                    <td colSpan="3"><T>totalIncVAT</T></td>
                    <td><PriceRight amount={discount*totalAmountVAT} style={{fontWeight:'bold'}} /></td>
                    <td colSpan="2" />
                  </tr>
                </tfoot>
              </Table>
            </section>

            <section>
              <Button onClick={()=>{}} className="float-right"><T>{project.invoices.length&&'addReminder'||'addInvoice'}</T></Button>
              <h3><T>invoices</T></h3>
              <ol>
                {project.invoices.map((invoice, index)=><li className="row no-gutters" key={index}>
                  <div className="col-4">
                    <ButtonLink to={`${getProjectHref(project)}/${invoice.type}${index!==0?'/'+index:''}`}>
                      <T>{invoice.type}</T>{index!==0?nbsp + index:''}
                  </ButtonLink>
                  </div>
                  <div className="col hide-low">{getProjectNumber(project, state)}</div>
                  <div className="col-3">{invoice.date}</div>
                  <div className="col">
                    {invoice.interest&&<Icon type="promile" title={t('legalInterestWasAdded')}><T>legalInterestWasAdded</T></Icon>}
                    {invoice.exhortation&&<Icon type="stop" title={t('finalExhortation')} />}
                    {invoice.paid&&<Icon type="money" title={t('paid')+': '+invoice.paid} />}{/*todo: format amount*/}
                  </div>
                  <div className="col text-align-right">
                    {index===project.invoices.length-1&&<IconButton type="close" onClick={console.log.bind(console, 'todo onRemoveInvoice(invoice)')} />}{/*todo onRemoveInvoice(invoice)*/}
                    <IconButton type="pencil" onClick={console.log.bind(console, 'todo onEditInvoice(invoice)')} />{/*todo onEditInvoice(invoice)*/}
                  </div>
                </li>)}
              </ol>
            </section>
          </>
        )) || <p><T>project not found</T></p>
      )
    }
  )
)
