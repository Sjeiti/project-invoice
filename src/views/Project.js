import React, {useEffect, useState, useRef} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, cloneDeep} from 'lodash'
import {nbsp,getGetSetter,getDateString} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject, cloneProject} from '../model/clients/actions'
import {
  getClient,
  getProject,
  getClients,
  getClientHref,
  getProjectHref,
  getProjectNumber,
  getDiscountPart,
  getTotalHours,
  getTotal,
  getTotalDiscounted,
  getTotalIncDiscounted,
  getNextProjectHref,getPreviousProjectHref
} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Button, IconButton} from '../components/Button'
import {ButtonLink} from '../components/ButtonLink'
import {InputText, InputDate, InputNumber, InputCheckbox} from '../components/Input'
import {Table} from '../components/Table'
import {Textarea} from '../components/Textarea'
import {Icon} from '../components/Icon'
import {Price} from '../components/Price'
import {Select} from '../components/Select'
import {T} from '../components/T'
import {useTranslation} from 'react-i18next'
import {color} from '../service/css'
import {Dialog} from '../components/Dialog'
import {FormSpan} from '../components/FormSpan'
import {CSSTransition,TransitionGroup} from 'react-transition-group'
import styled from 'styled-components'
import {getCloneProjectEvents,getNextProjectEvents,getPreviousProjectEvents} from '../model/eventFactory'

const StyledProject = styled.div`
  .description {
    display: inline-block;
    width: calc(100% - 1.5rem);
    +label {
      display: inline-block;
      width: 1rem;
      margin-left: 0.5rem;
    }
  }
`

const editablePropNames = [
  {key:'discount', input:InputNumber}
  , {key:'hourlyRate', input:InputNumber}
  , {key:'paid', input:InputCheckbox}
  , {key:'ignore', input:InputCheckbox}
]

const PriceRight = props => <Price {...props} className="float-right" />

export const Project = withRouter(
  connect(
    state => ({ state, clients: getClients(state) }),
    { storeProject, removeProject, cloneProject }
  )(
    ({
      history
      , match: {
        params: { client: clientNr, project: projectId }
      }
      , storeProject
      , removeProject
      , cloneProject
      , state
      , clients
    }) => {
      const {t} = useTranslation()

      const client = getClient(clients, clientNr)
      const projectOld = client && getProject(client.projects, projectId)
      const isProject = !!projectOld

      const [project, setProject] = useState(projectOld)
      const {hourlyRate, lines} = project
      const getSetter = getGetSetter(project, setProject)

      // cloning
      const cloneProjectEvents = getCloneProjectEvents(clients, project, cloneProject)
      useEffect(() => project.id!==projectId && setProject(projectOld), [projectId]);

      // invoices
      const [invoiceDialogOpen, setInvoiceDialog] = useState(false)
      const [invoice, setInvoice] = useState({})
      const [invoiceSource, setInvoiceSource] = useState()
      const getInvoiceSetter = key => value => {
        const invoiceTemp = {...invoice}
        invoiceTemp[key] = value
        setInvoice(invoiceTemp)
      }
      const [invoiceSubmit, setInvoiceSubmit] = useState(()=>()=>{})
      const onClickEditInvoiceButton = (index, e)=>{
        setInvoice({...project.invoices[index]})
        setInvoiceSource(e.target.closest('li'))
        setInvoiceDialog(true)
        setInvoiceSubmit(()=>invoice=>{
          const p = cloneDeep(project)
          p.invoices[index] = invoice
          setProject(p)
          setInvoiceDialog(false)
        })
      }
      const onClickDeleteInvoiceButton = () => {
        const p = cloneDeep(project)
        p.invoices.pop()
        setProject(p)
      }
      const onClickAddInvoiceButton = () => {
        const p = cloneDeep(project)
        const {invoices, invoices: {length}} = p
        invoices.push({...invoices[length-1], ...{date:getDateString(), paid:''}})
        setProject(p)
      }

      // saveable
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
        const p = cloneDeep(project)//{...project}//
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
        , {key:'amount', th:<T>amount</T>}
        , {key:'vat', th:<T>vat</T>}
        , {key:'action'}
      ]
      hourlyRate>0 && projectLineCols.splice(2,0,...[
        {key:'hours', th:<T>hours</T>}
        , {key:'times', th:<Button onClick={onClickArrow2bar} invert>⇥</Button> }
      ])
      const getLineSetter = index => (key, format) => value => {
        const p = cloneDeep(project)//{...project}//
        p.lines[index][key] = format?format(value):value
        setProject(p)
      }
      const vatOptions = [0, 9, 21].map(value=>({value, text:value}))
      const projectLineSubjects = lines.map((line, index) => {
        const {description, hours, amount, vat} = line
        const lineSetter = getLineSetter(index)
        const amountSetter = lineSetter('amount', parseFloat)
        const cols = {
          drag: <Icon type="drag" style={{color:color.colorButton}} />
          , description: <InputText value={description} setter={lineSetter('description')} />
          , amount: <InputNumber value={amount} setter={amountSetter} />
          , vat: <Select value={vat} options={vatOptions} setter={lineSetter('vat', parseFloat)} />
          , action: <IconButton className="float-right" onClick={()=>{
            const p = cloneDeep(project)
            p.lines.splice(index, 1)
            setProject(p)
          }} type="close" />
        }
        hourlyRate>0 && Object.assign(cols, {
          hours: <InputNumber value={hours} setter={lineSetter('hours', parseFloat)} />
          , times: <Price amount={hours*hourlyRate} onClick={amountSetter.bind(null, hours*hourlyRate)} />
        })
        return cols
      })

      function onClickArrow2bar(){
        const p = cloneDeep(project)
        lines.map(({hours}, index) => p.lines[index]['amount'] = parseFloat(hours*hourlyRate))
        setProject(p)
      }

      const totalHours = getTotalHours(project)
      const discount = getDiscountPart(project)

      return (
        (isProject && (
          <StyledProject>

            <header className="clearfix">
              <h3><Link to={getClientHref(client)}>{client.name||nbsp}</Link></h3>
              <h2 className="float-left">{project.description||nbsp}</h2>
              <div className="float-right">
                <ButtonLink {...getPreviousProjectEvents(client, project)}>&lt;</ButtonLink>
                {/*<ButtonLink to={getPreviousProjectHref(client, project)}>&lt;</ButtonLink>*/}
                {/*<ButtonLink to={getNextProjectHref(client, project)}>&gt;</ButtonLink>*/}
                <ButtonLink {...getNextProjectEvents(client, project)}>&gt;</ButtonLink>
                <ButtonLink {...cloneProjectEvents}><T>Clone</T></ButtonLink>
              </div>
            </header>

            <section>
              <Label className="description"><T>description</T><InputText value={project.description} setter={getSetter('description')} /></Label>
              <label htmlFor="projectProperties"><i className="icon-cog color-button"></i></label>
              <input id="projectProperties" type="checkbox" className="reveal" />
              <div>
              {editablePropNames.map(
                ({key, input:Input}, index) =>
                  <Label key={index}>
                    <T>{key}</T>
                    <Input value={project[key]} setter={getSetter(key)} />
                  </Label>
              )}
              </div>
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
                    {hourlyRate>0&&<>
                      <td>{totalHours}</td>
                      <td><PriceRight amount={totalHours*hourlyRate} /></td>
                    </>}
                    <td><PriceRight amount={getTotal(project)} /></td>
                    <td colSpan="2" />
                  </tr>
                  {!!project.discount&&<tr>
                    <td />
                    <td colSpan={hourlyRate>0?2:0}><T>discount</T> {project.discount}%</td>
                    {hourlyRate>0&&<>
                      <td><PriceRight amount={discount*totalHours*hourlyRate} /></td>
                    </>}
                    <td><PriceRight amount={getTotalDiscounted(project)} /></td>
                    <td colSpan="2" />
                  </tr>}
                  <tr>
                    <td />
                    <td colSpan={hourlyRate>0?3:1}><T>totalIncVAT</T></td>
                    <td><PriceRight amount={getTotalIncDiscounted(project)} style={{fontWeight:'bold'}} /></td>
                    <td colSpan="2" />
                  </tr>
                </tfoot>
              </Table>
            </section>

            <section>
              <Button onClick={onClickAddInvoiceButton} className="float-right"><T>{project.invoices.length&&'addReminder'||'addInvoice'}</T></Button>
              <h3><T>invoices</T></h3>
              <TransitionGroup component="ol">
                {project.invoices.map((invoice, index)=>
                    <CSSTransition
                      timeout={200}
                      classNames="anim-li-height"
                      key={index}
                    >
                      <li className="row no-gutters" key={index}>
                        <div className="col-4">
                          <ButtonLink to={`${getProjectHref(project)}/${invoice.type}${index!==0?'/'+index:''}`}>
                            <T>{invoice.type}</T>{index!==0?nbsp + index:''}
                        </ButtonLink>
                        </div>
                        <div className="col hide-low"><FormSpan>{getProjectNumber(project, state)}</FormSpan></div>
                        <div className="col-3"><FormSpan>{invoice.date}</FormSpan></div>
                        <div className="col">
                          {invoice.interest&&<Icon type="promile" title={t('legalInterestWasAdded')}></Icon>}
                          {invoice.exhortation&&<Icon type="stop" title={t('finalExhortation')} />}
                          {invoice.paid&&<Icon type="money" title={t('paid')+': '+invoice.paid} />}{/*todo: format amount*/}
                        </div>
                        <div className="col text-align-right">
                          {index===project.invoices.length-1&&<IconButton type="close" onClick={onClickDeleteInvoiceButton} />}
                          <IconButton type="pencil" onClick={onClickEditInvoiceButton.bind(null, index)} />
                        </div>
                      </li>
                    </CSSTransition>
                )}
              </TransitionGroup>
            </section>

            <section>
              <Button onClick={onClickAddInvoiceButton} className="float-right"><T>show quotation</T></Button>
              <h3><T>quotation</T></h3>
              {[
                { key: 'quotationDate', Element: InputDate }
                , { key: 'quotationStartDate', Element: InputDate }
                , { key: 'quotationDuration', Element: InputNumber }
                , { key: 'quotationSubject', Element: InputText }
                , { key: 'quotationBefore', Element: Textarea }
                , { key: 'quotationAfter', Element: Textarea }
              ].map(({key, Element}) => {
                return <Label key={key}><T>{key}</T><Element value={project[key]} setter={getSetter(key)} /></Label>
              })}
            </section>

            <Dialog
                show={invoiceDialogOpen}
                title={'Edit '+invoice.type}
                close={()=>setInvoiceDialog(false)}
                submit={()=>invoiceSubmit(invoice)}
                source={invoiceSource}
                sourceTransform={r=>{
                  const {bottom, height, left, right, top, width, x, y} = r
                  return {bottom: bottom-4, height, left, right, top, width, x, y}
                }}
            >
              <Label>Date<InputDate value={invoice.date} setter={getInvoiceSetter('date')}/></Label>
              {invoice.type!=='invoice'&&<>
                <Label>Interest<InputCheckbox value={invoice.interest} setter={getInvoiceSetter('interest')}/></Label>
                <Label>Exhortation<InputCheckbox value={invoice.exhortation} setter={getInvoiceSetter('exhortation')}/></Label>
              </>}
              <Label>Paid<InputNumber value={invoice.paid} setter={getInvoiceSetter('paid')}/></Label>
            </Dialog>
          </StyledProject>
        )) || <StyledProject><T>project not found</T></StyledProject>
      )
    }
  )
)
