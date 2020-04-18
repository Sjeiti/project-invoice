import React, {useState} from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import {Trans} from 'react-i18next'
import styled from 'styled-components'
import {getGetSetter, getInterpolationContext, isEqual} from '../util'
import {I18N_ISO as isos} from '../config/i18n'
import {CURRENCY_ISO} from '../config/currencyISO'
import {saveable} from '../util/signal'
import {storeConfig} from '../model/config/actions'
import {restoreState} from '../model/rootActions'
import {getConfig} from '../model/config/selectors'
import {getClients} from '../model/clients/selectors'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'
import {Select} from '../components/Select'
import {InputText, InputCheckbox} from '../components/Input'
import {Label} from '../components/Label'
import {SettingsData} from '../components/SettingsData'
import {SettingsPeer2Peer} from '../components/SettingsPeer2Peer'
import {SettingsEncryption} from '../components/SettingsEncryption'
import {SettingsCloud} from '../components/SettingsCloud'
import {T} from '../components/T'
import {InterpolationInput} from '../components/InterpolationInput'

const Section = styled.section`
  &:after {
    content: '';
    display: table;
    clear: both;
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

    const storeConfigWith = obj => {
        const newConfig = Object.assign({...config}, obj)
        setConfig(newConfig)
        storeConfig(newConfig)
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
              <SettingsData {...{state, restoreState}} />
              <p><Trans>dataExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>peer2peerTitle</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <SettingsPeer2Peer {...{state, restoreState}} />
              <p><Trans>peer2peerExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>encryption</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <SettingsEncryption {...{config, session, storeSession, storeConfigWith}} />
              <p><Trans>encryptionExplain</Trans></p>
            </div>
          </Section>
          <Section>
            <h2 className="col-12 col-sm-3 float-left"><T>cloudsync</T></h2>
            <div className="col-12 col-sm-9 float-left">
              <SettingsCloud {...{config, storeConfigWith}} />
              <p><Trans>cloudExplain</Trans></p>
            </div>
          </Section>
        </>
    )
  })