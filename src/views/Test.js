import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'
import {Button, IconButton} from '../components/Button'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {ButtonLink} from '../components/ButtonLink'
import {ButtonLabel} from '../components/ButtonLabel'
import {isEqual, cloneDeep} from 'lodash'
import {nbsp,getGetSetter,getDateString} from '../utils'
import {saveable} from '../saveable'
import {storeProject, removeProject} from '../model/clients/actions'
import {getClient, getProject, getClients, getClientHref, getProjectHref, getProjectNumber} from '../model/clients/selectors'
import {Label} from '../components/Label'
import {InputText, InputDate, InputNumber, InputCheckbox} from '../components/Input'
import {Table} from '../components/Table'
import {Icon} from '../components/Icon'
import {Price} from '../components/Price'
import {Select} from '../components/Select'
import {T} from '../components/T'
import {useTranslation} from 'react-i18next'
import {color} from '../cssService'
import {Dialog} from '../components/Dialog'
import {CSSTransition,TransitionGroup} from 'react-transition-group'

// const editablePropNames = [
//   {key:'description', input:InputText}
//     , {key:'hourlyRate', input:InputNumber}
//     , {key:'discount', input:InputNumber}
//     , {key:'paid', input:InputCheckbox}
//     , {key:'quotationDate', input:InputText}
// ]

// const PriceRight = props => <Price {...props} className="float-right" />

export const Test = withRouter(
  connect(state => ({ state }))(
    ({ state }) => {
      // const {t} = useTranslation()

      // const client = getClient(clients, clientNr)
      // const projectOld = client && getProject(client.projects, projectId)
      // const isProject = !!projectOld
      //
      // const [project, setProject] = useState(projectOld)
      // const {hourlyRate, lines} = project
      // const getSetter = getGetSetter(project, setProject)
      //
      // // invoices
      // const [invoiceDialogOpen, setInvoiceDialog] = useState(false)
      // const [invoice, setInvoice] = useState({})
      // const [invoiceSource, setInvoiceSource] = useState()

      return <>
        <h3>UI element test page</h3>

        <p>Page for testing how different components react to one another in terms of spacing and sizing.</p>

        <h2>Buttons</h2>

        <section>
          <Button>Button</Button>
          <IconButton type="pencil" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <ButtonLink>ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="drag" />
          <ButtonLink>ButtonLink</ButtonLink>
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <Button>Button</Button>
          <ButtonLink>ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="add" />
          <IconButton type="add" invert />
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonLink>ButtonLink</ButtonLink>
          <IconButton type="eye" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
        </section>

        <h2>Input elements</h2>

        <section>
          <InputCheckbox />
          <InputText />
          <InputNumber />
          <InputDate />
          <InputCheckbox />
          <InputText />
          <InputNumber />
          <InputDate />
        </section>

        <h2>Mixed buttons and input elements</h2>

        <section>
          <Button>Button</Button>
          <InputCheckbox />
          <IconButton type="pencil" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputText />
          <ButtonLink>ButtonLink</ButtonLink>
          <InputNumber />
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="drag" />
          <InputCheckbox />
          <ButtonLink>ButtonLink</ButtonLink>
          <Button>Button</Button>
          <IconButton type="eye" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputDate />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputDate />
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <InputText />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <Button>Button</Button>
          <ButtonLink>ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="add" />
          <IconButton type="add" invert />
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonLink>ButtonLink</ButtonLink>
          <InputNumber />
        </section>
      </>
    }
  )
)
