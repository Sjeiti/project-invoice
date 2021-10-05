import React, {useState} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Button, IconButton} from '../components/Button'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {ButtonLink} from '../components/ButtonLink'
import {ButtonLabel} from '../components/ButtonLabel'
import {InputText, InputDate, InputNumber, InputCheckbox} from '../components/Input'
import {Select} from '../components/Select'
import {Textarea} from '../components/Textarea'
import {Label} from '../components/Label'
import {FormSpan} from '../components/FormSpan'
import {getInterpolationContext} from '../util'
import {InterpolationInput} from '../components/InterpolationInput'
import {notify} from '../util/signal'
import {ERROR} from '../components/Notification'

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

      const [foo, setFoo] = useState('bar')

      return <>
        <h3>UI element test page</h3>

        <p>Page for testing how different components react to one another in terms of spacing and sizing.</p>

        <h2>Buttons</h2>

        <section>
          <Button>Button</Button>
          <IconButton type="pencil" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="drag" />
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <Button>Button</Button>
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="add" />
          <IconButton type="add" invert />
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonLink to="#">ButtonLink</ButtonLink>
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
          <Select options={[{text:'nee', value:0}]} />
          <Textarea defaultValue="My hoovercraft is full of eels" />
          <InputCheckbox disabled />
          <InputText disabled />
          <InputNumber disabled />
          <InputDate disabled />
          <Select disabled options={[{text:'nee', value:0}]} />
          <Textarea disabled defaultValue="My hoovercraft is full of eels" />
          <InputCheckbox />
          <InputText />
          <InputNumber />
          <InputDate />
        </section>

        <h2>Mixed buttons and input elements</h2>

        <section>
          <Button>Button</Button>
          <InputCheckbox />
          <span>foo</span>
          <FormSpan>lorem</FormSpan>
          <IconButton type="pencil" />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputText />
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <FormSpan>ispum</FormSpan>
          <InputNumber />
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="drag" />
          <InputCheckbox />
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <Button>Button</Button>
          <IconButton type="eye" />
          <span>bar</span>
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputDate />
          <FormSpan>dolor</FormSpan>
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <InputDate />
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <span>baz</span>
          <InputText />
          <ButtonAnchor>ButtonAnchor</ButtonAnchor>
          <Button>Button</Button>
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <IconButton type="add" />
          <IconButton type="add" invert />
          <Button>Button</Button>
          <ButtonLabel>ButtonLabel</ButtonLabel>
          <ButtonLink to="#">ButtonLink</ButtonLink>
          <InputNumber />
        </section>

        <h2>Input elements with label</h2>

        <section>
          <Label>InputCheckbox<InputCheckbox /></Label>
          <Label>InputText<InputText /></Label>
          <Label>textarea<Textarea defaultValue="My hoovercraft is full of eels" /></Label>
          <Label>InputNumber<InputNumber /></Label>
          <Label>InputDate<InputDate /></Label>
          <Label>Select<Select options={[{text:'nee', value:0}]} /></Label>
          <Label>InputText lorem ipsum dolor sit amet etc <InputText /></Label>

          <Label>Button<Button>Button</Button></Label>
          <Label>IconButton<IconButton type="pencil" /></Label>
          <Label>ButtonAnchor<ButtonAnchor>ButtonAnchor</ButtonAnchor></Label>
          <Label>ButtonLink<ButtonLink to="#">ButtonLink</ButtonLink></Label>
        </section>

        <h2>Interpolation</h2>

        <section>
          <Label>Foo<InterpolationInput
                multiline
                context={getInterpolationContext(state)}
                value={foo}
                setter={setFoo}
          /></Label>
        </section>

        <h2>Notifications</h2>

        <section>
          <Button onClick={()=>notify.dispatch('hello')}>Notify me</Button>
          <Button onClick={()=>notify.dispatch({message:'holle', type:ERROR})}>Error me</Button>
          <Button onClick={()=>notify.dispatch('Definition of multiline: composed of, involving, or able to accommodate more than one line: such as\n' + 'a : consisting of multiple lines of text a multiline headline : capable of showing, containing, or processing multiple lines of text a multiline display/field New multiline optical character readers are already being put in place; they can read an entire address and spray forth a bar code that stands for a nine-digit ZIP …— Jake Page. b : having or involving multiple telecommunications lines a multiline phone plan. c : having or selling multiple product lines It is a single-line car dealer in an era of hungry multiline megadealers.— Thomas Moore While most agents specialize in life insurance, a growing number (called multiline agents) offer both life and property/casualty policies. — Occupational Outlook Handbook')}>Multiline</Button>
          <Button onClick={()=>notify.dispatch('An anchor link to <a href="/settings">the settings page</a>')}>A link</Button>
          <Button onClick={()=>notify.dispatch({message: <>A button link to <ButtonLink to="/settings">the settings page</ButtonLink> or a <ButtonLabel>ButtonLabel</ButtonLabel> or a <ButtonAnchor>ButtonAnchor</ButtonAnchor></>})}>Buttons</Button>

        </section>
      </>
    }
  )
)
