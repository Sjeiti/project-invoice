import React, {useState} from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import {Trans, useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {getDateString, getGetSetter, getInterpolationContext, isEqual} from '../util'
import {I18N_ISO as isos} from '../config/i18n'
import {CURRENCY_ISO} from '../config/currencyISO'
import {saveable} from '../util/signal'
import {storeConfig} from '../model/config/actions'
import {restoreState} from '../model/rootActions'
import {getConfig} from '../model/config/selectors'
import {data as defaultData} from '../model/default'
import {getClients} from '../model/clients/selectors'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'
import {Select} from '../components/Select'
import {InputText, InputCheckbox} from '../components/Input'
import {Label} from '../components/Label'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {ButtonLabel} from '../components/ButtonLabel'
import {Button} from '../components/Button'
import {PeerUI} from '../components/PeerUI'
import {T} from '../components/T'
import {Dialog} from '../components/Dialog'
import {ID as driveID} from '../service/cloudDrive'
import {InterpolationInput} from '../components/InterpolationInput'

const Section = styled.section`
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`
const StyledDialog = styled(Dialog)`
  input[type="text"] {
    width: 100%;
    margin-right: 2px;
  }
`

const currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key])

const varMap = {
  uilang: {Element:Select, title:'applicationLanguage', attrs:{options:isos.map(iso=>({value:iso, text:iso}))}}
  , projectNumberTemplate: {Element:InterpolationInput}
  , csvTemplate: {Element:InterpolationInput}
  , currency: {Element:Select, attrs:{options:currencies.map(({code, name, symbol})=>({value:code, text:`${name} (${symbol})`}))}}
  , homeMessage: {Element:InputCheckbox, title:'showHomeMessage'}
  , langs: {Element:InputText, title:'invoiceLanguages', map: v=>v.toString().split(',')}
}

export const Settings = connect(
    state => ({ configOld: getConfig(state), session: getSession(state), clients: getClients(state), state }),
    { storeConfig, restoreState, storeSession }
  )(({ state, configOld, storeConfig, restoreState, session, storeSession, clients }) => {
    const [config, setConfig] = useState(configOld)
    const getSetter = getGetSetter(config, setConfig)
    const downloadString = 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state))

    const {t} = useTranslation()

    const storeConfigWith = obj => {
        const newConfig = Object.assign({...config}, obj)
        setConfig(newConfig)
        storeConfig(newConfig)
    }

    const [encryptionDialogOpen, setEncryptionDialog] = useState(false)
    const [encryptionKey, setEncryptionKey] = useState('')
    const encryptAndReload = ()=>{
      if (encryptionKey) {
        storeSession({...session, encryptionKey})
        storeConfigWith({
          encryption: true
        })
        setEncryptionDialog(false)
        window.location.reload()
      } else {
        // todo warn about invalid password
      }
    }

    const isDirty = !isEqual(configOld, config)
    saveable.dispatch(
        true
        , isDirty && (()=>{
            storeConfig(config)
            configOld.uilang!==config.uilang&&i18next.changeLanguage(config.uilang)
          }) || null
        , isDirty && (() => setConfig(configOld)) || null
        , null
    )

    const [cloudProvider, setCloudProvider] = useState(config.cloudSelected)
    const cloudProviders = [
      {value: driveID, text:'Google Drive'}
      , {value:'', text:'-other-'}
    ]
    const cloudAuthorise = ()=>{
      storeConfigWith({cloudSelected: cloudProvider})
    }
    const cloudRevoke = ()=>{
      storeConfigWith({cloudSelected: ''})
    }

    const context = getInterpolationContext(state)

    return (
        <>
          <Section>
            <h1 className="hide-low"><T>settings</T></h1>
            {Object.entries(varMap).map(([key, {Element, title, map, attrs={}}], i)=>
              <React.Fragment key={i}>
                <Label>
                  <T>{title||key}</T>
                  <Element
                      value={config[key]}
                      setter={map&&(v=>getSetter(key)(map(v)))||getSetter(key)}
                      context={context}
                      {...attrs}></Element>
                </Label>
              </React.Fragment>
            )}
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>data</T> <small>({clients.length})</small></h2>
            <div className="col-12 col-sm-9 float-left">
              <ButtonAnchor href={downloadString} download={`data_${getDateString()}.json`}><T>download</T></ButtonAnchor>
              <ButtonLabel htmlFor="restore"><T>restore</T></ButtonLabel>
              <input accept="application/json, text/json, .json" onChange={onChangeRestore.bind(null,restoreState)} type="file" id="restore" className="visually-hidden"/>
              <Button onClick={()=>restoreState(defaultData)}><T>clear</T></Button>
              <p><Trans>dataExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>peer2peerTitle</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <PeerUI data={JSON.stringify(state)} restore={restoreState} />
              <p><Trans>peer2peerExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>encryption</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <Button onClick={()=>setEncryptionDialog(true)} disabled={config.encryption}><T>enable</T></Button>
              <Button onClick={()=>storeConfigWith({encryption:false})} disabled={!config.encryption}><T>disable</T></Button>
              <p><Trans>encryptionExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>cloud sync</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <Select value={cloudProvider} setter={setCloudProvider} disabled={config.cloudSelected} options={cloudProviders} />
              <Button onClick={cloudAuthorise} disabled={!!config.cloudSelected}><T>authorise</T></Button>
              <Button onClick={cloudRevoke} disabled={!config.cloudSelected}><T>revoke</T></Button>
              <p><Trans>cloudExplain</Trans></p>
            </div>
          </Section>

          <StyledDialog
              show={encryptionDialogOpen}
              title={t('passwordSet')}
              close={()=>setEncryptionDialog(false)}
              submit={()=>encryptAndReload()}
          >
            <T>passwordResetReload</T>
            <InputText value={encryptionKey} setter={setEncryptionKey} />
          </StyledDialog>
        </>
    )
  })

function onChangeRestore(restoreState, e){
  const target = e.target
  const fileReader = new FileReader()
  const file = target.files[0]
  fileReader.readAsText(file)
  fileReader.addEventListener('load', ()=>{
    const result = fileReader.result
    const resultData = JSON.parse(result) // todo decryptAndOrParse
    if (resultData&&resultData.clients&&resultData.copy&&resultData.personal){
      restoreState(resultData)
    }
  })
}