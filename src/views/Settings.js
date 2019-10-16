import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import i18next from 'i18next'
import {Trans} from 'react-i18next'
import {getDateString,getGetSetter,isEqual} from '../utils'
import {I18N_ISO as isos} from '../config/i18n'
import {CURRENCY_ISO} from '../config/currencyISO'
import { saveable } from '../saveable'
import {storeConfig} from '../model/config/actions'
import {restoreState} from '../model/rootActions'
import {getConfig} from '../model/config/selectors'
import {data as defaultData} from '../model/default'
import {getClients} from '../model/clients/selectors'
import {Select} from '../components/Select'
import {Input, InputCheckbox} from '../components/Input'
import {Label} from '../components/Label'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {ButtonLabel} from '../components/ButtonLabel'
import {Button} from '../components/Button'
import {T} from '../components/T'

const currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key])

const varMap = {
  uilang: {Element:Select, title:'applicationLanguage', attrs:{options:isos.map(iso=>({value:iso, text:iso}))}}
  , projectNumberTemplate: {Element:Input}
  , csvTemplate: {Element:Input}
  , currency: {Element:Select, attrs:{options:currencies.map(({code, name, symbol})=>({value:code, text:`${name} (${symbol})`}))}}
  , homeMessage: {Element:InputCheckbox, title:'showHomeMessage'}
  , langs: {Element:Input, title:'invoiceLanguages', map:v=>v.toString().split(',')}
}

export const Settings = connect(
    state => ({ configOld: getConfig(state), clients: getClients(state), state }),
    { storeConfig, restoreState }
  )(({ state, configOld, storeConfig, restoreState, clients }) => {
    const [config, setConfig] = useState(configOld)
    const getSetter = getGetSetter(config, setConfig)
    const downloadString = 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state))

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

    return (
        <>
          <section>
            <h1 className="hide-low"><T>settings</T></h1>
            {Object.entries(varMap).map(([key, {Element, title, map, attrs={}}], i)=>
              <React.Fragment key={i}>
                <Label>
                  <T>{title||key}</T>
                  <Element value={config[key]} setter={map&&(v=>getSetter(key)(map(v)))||getSetter(key)} {...attrs}></Element>
                </Label>
              </React.Fragment>
            )}
          </section>
          <section>
            <h2 className="col-12 col-sm-3 float-left"><T>data</T> <small>({clients.length})</small></h2>
            <div className="col-12 col-sm-9 float-left">
              <ButtonAnchor href={downloadString} download={`data_${getDateString()}.json`}><T>download</T></ButtonAnchor>
              <ButtonLabel htmlFor="restore"><T>restore</T></ButtonLabel>
              <input accept="application/json, text/json, .json" onChange={onChangeRestore.bind(null,restoreState)} type="file" id="restore" className="visually-hidden"/>
              <Button onClick={()=>restoreState(defaultData)}><T>clear</T></Button>
              <p><Trans>dataExplain</Trans></p>
            </div>
          </section>
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