import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {isEqual, cloneDeep} from 'lodash'
import {nbsp, getGetSetter, capitalise, moveArrayItem, getInterpolationContext} from '../util'
import {saveable} from '../util/signal'
import {storeProject, removeProject, cloneProject} from '../model/clients/actions'
import {
  getClient
  , getProject
  , getClients
  , getClientHref
  , getProjectHref
  , getProjectNumber
  , getDiscountPart
  , getTotalHours
  , getTotal
  , getTotalDiscounted
  , getTotalIncDiscounted
} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {Button, IconButton} from '../components/Button'
import {ButtonLink} from '../components/ButtonLink'
import {InputText, InputDate, InputNumber, InputCheckbox} from '../components/Input'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {Price} from '../components/Price'
import {Select} from '../components/Select'
import {T} from '../components/T'
import {useTranslation} from 'react-i18next'
import {Dialog} from '../components/Dialog'
import {Tabs} from '../components/Tabs'
import {FormSpan} from '../components/FormSpan'
import {InterpolationInput} from '../components/InterpolationInput'
import {DirtyPrompt} from '../components/DirtyPrompt'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import styled from 'styled-components'
import {getCloneProjectEvents, getNextProjectEvents, getPreviousProjectEvents} from '../model/eventFactory'
import {getInvoice} from '../model/clients/factory'
import {getData} from '../model/personal/selectors'

const StyledProject = styled.div`
  label.description {
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

const DragHandleStyled = styled(Icon)`
  color: var(--color-button);
  cursor: grab;
`
const DragHandle = ()=><DragHandleStyled type="drag" />

export const Project = withRouter(
  connect(
    state => ({ state, clients: getClients(state), data: getData(state) }),
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
      , data
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
      useEffect(() => project.id!==projectId && setProject(projectOld), [projectId])

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
        p.invoices.push(getInvoice())
        setProject(p)
      }

      // saveable
      useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])
      const isDirty = isProject&&!isEqual(projectOld, project)
      if (isProject){
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
        const p = cloneDeep(project) // {...project} //
        p.lines.push({
          description:''
          , hours: 0
          , amount: 0
          , vat: 0
        })
        setProject(p)
      }
      const moveLine = (nr, to)=>{
        const {lines} = project
        const p = cloneDeep(project)
        p.lines = moveArrayItem(lines, nr, to)
        setProject(p)
      }
      const projectLineCols = [
        {key:'drag'}
        , {key:'description', th:<T>description</T>}
        , {key:'amount', th:<T>amount</T>}
        , {key:'vat', th:<T>vat</T>}
        , {key:'action'}
      ]
      hourlyRate>0 && projectLineCols.splice(2, 0, ...[
        {key:'hours', th:<T>hours</T>}
        , {key:'times', th:<Button onClick={onClickArrow2bar} invert={1}>⇥</Button> }
      ])
      const getLineSetter = index => (key, format) => value => {
        const p = cloneDeep(project)//{...project}//
        p.lines[index][key] = format?format(value):value
        setProject(p)
      }
      const vatOptions = data.vatAmounts.split(',').map(s=>parseFloat(s)).map(value=>({value, text:value}))
      const projectLineSubjects = lines.map((line, index) => {
        const {description, hours, amount, vat} = line
        const lineSetter = getLineSetter(index)
        const amountSetter = lineSetter('amount', parseFloat)
        const cols = {
          drag: <DragHandle />
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
          , times: <Price className={'float-right'} amount={hours*hourlyRate} onClick={amountSetter.bind(null, hours*hourlyRate)} />
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

      const context = getInterpolationContext(state)

      return (
        (isProject && (
          <StyledProject>

            <header className="clearfix">
              <h3 className="float-left base-height"><Link to={getClientHref(client)} data-cy="clientLink">{client.name||nbsp}</Link></h3>
              <div className="float-right">
                <ButtonLink invert={1} {...getPreviousProjectEvents(client, project)} data-cy="previousProject"><i className="icon-chevron-left" /></ButtonLink>
                <ButtonLink invert={1} {...getNextProjectEvents(client, project)} data-cy="nextProject"><i className="icon-chevron-right" /></ButtonLink>
                <ButtonLink {...cloneProjectEvents} data-cy="clone"><T>clone</T></ButtonLink>
              </div>
              <h2 className="clear" data-cy="projectHeading">{project.description||nbsp}</h2>
            </header>

            <section>
              <Label className="description"><T>description</T><InputText value={project.description} setter={getSetter('description')} /></Label>
              <label htmlFor="projectProperties"><i className="icon-cog color-button" /></label>
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

            <section data-cy="linesSection">
              <Button onClick={addLine} className="float-right" data-cy="newLine"><T>new line</T></Button>
              <h3 className="base-height"><T>lines</T></h3>
              <Table
                  cols={projectLineCols}
                  subjects={projectLineSubjects}
                  className="clear"
                  draggableRows={true}
                  dragged={moveLine}
              >
                <tfoot>
                  <tr>
                    <td />
                    <td><T>totalExVAT</T></td>
                    {hourlyRate>0&&<>
                      <td>{totalHours}</td>
                      <td><PriceRight amount={totalHours*hourlyRate} /></td>
                    </>}
                    <td><PriceRight amount={getTotal(project)} data-cy="totalExVAT" /></td>
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
                    <td><PriceRight amount={getTotalIncDiscounted(project)} style={{fontWeight:'bold'}} data-cy="totalIncVAT" /></td>
                    <td colSpan="2" />
                  </tr>
                </tfoot>
              </Table>
            </section>

            <Tabs currentIndex={project.invoices.length?0:1}>
              <section>
                <Button onClick={onClickAddInvoiceButton} className="float-right" data-cy="addInvoice"><T>{project.invoices.length&&'addReminder'||'addInvoice'}</T></Button>
                <h3 className="invisible"><T>invoices</T></h3>
                <TransitionGroup component="ol" data-cy="invoices">
                  {project.invoices.map((invoice, index)=>
                      <CSSTransition
                        timeout={200}
                        classNames="anim-li-height"
                        key={index}
                      >
                        <li className="row no-gutters" key={index}>
                          <div className="col-4">
                            <ButtonLink to={`${getProjectHref(project)}/${invoice.type}${index!==0?'/'+index:''}`}>
                              <T>{index===0?'invoice':'reminder'}</T>
                              {index!==0?nbsp + index:''}
                          </ButtonLink>
                          </div>
                          <div className="col hide-low"><FormSpan>{getProjectNumber(project, state)}</FormSpan></div>
                          <div className="col-3"><FormSpan>{invoice.date}</FormSpan></div>
                          <div className="col">
                            {invoice.interest&&<Icon type="promile" title={t('legalInterestWasAdded')} />}
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
                <ButtonLink to={`${getProjectHref(project)}/quotation`} className="float-right"><T>show quotation</T></ButtonLink>
                <h3 className="invisible"><T>quotation</T></h3>
                {[
                  { key: 'quotationDate', Element: InputDate }
                  , { key: 'quotationStartDate', Element: InputDate }
                  , { key: 'quotationDuration', Element: InputNumber }
                  , { key: 'quotationSubject', Element: InputText }
                  , { key: 'quotationBefore', Element: InterpolationInput }
                  , { key: 'quotationAfter', Element: InterpolationInput }
                ].map(({key, Element}) => {
                  return <Label key={key}><T>{key}</T><Element
                      value={project[key]||''}
                      setter={getSetter(key)}
                      context={context}
                  /></Label>
                })}
              </section>
            </Tabs>

            <DirtyPrompt when={isDirty} />

            <Dialog
                show={invoiceDialogOpen}
                title={t('edit'+capitalise(invoice.type||'invoice'))}
                close={()=>setInvoiceDialog(false)}
                submit={()=>invoiceSubmit(invoice)}
                source={invoiceSource}
                sourceTransform={r=>{
                  const {bottom, height, left, right, top, width, x, y} = r
                  return {bottom: bottom-4, height, left, right, top, width, x, y}
                }}
            >
              <Label><T>date</T><InputDate value={invoice.date} setter={getInvoiceSetter('date')}/></Label>
              {invoice.type!=='invoice'&&<>
                <Label><T>legalInterest</T><InputCheckbox className={'float-right'} value={invoice.interest} setter={getInvoiceSetter('interest')}/></Label>
                <Label><T>exhortation</T><InputCheckbox className={'float-right'} value={invoice.exhortation} setter={getInvoiceSetter('exhortation')}/></Label>
              </>}
              <Label><T>paid</T><InputNumber value={invoice.paid||0} setter={getInvoiceSetter('paid')}/></Label>
            </Dialog>
          </StyledProject>
        )) || <StyledProject><T>project not found</T></StyledProject>
      )
    }
  )
)
