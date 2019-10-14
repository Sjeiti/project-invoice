import React, {useState} from 'react'
import {connect} from 'react-redux'
import {storeConfig} from '../model/config/actions'
import {restoreState} from '../model/rootActions'
import {getConfig} from '../model/config/selectors'
import {I18N_ISO as isos} from '../config/i18n'
import {CURRENCY_ISO} from '../config/currencyISO'
import {Select} from '../components/Select'
import {Input} from '../components/Input'
import {Label} from '../components/Label'
import {ButtonAnchor} from '../components/ButtonAnchor'
import {ButtonLabel} from '../components/ButtonLabel'
import {Button} from '../components/Button'
import {getDateString} from '../utils'
import {data as defaultData} from '../model/default'
import {getClients} from '../model/clients/selectors'

const currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key]) // todo cache or memoize (including langsJoined below)

const varMap = {
  uilang: {Element:Select, attrs:{options:isos.map(iso=>({value:iso, text:iso}))}}
  , projectNumberTemplate: {Element:Input}
  , csvTemplate: {Element:Input}
  , langsJoined: {Element:Input} // todo
  , currency: {Element:Select, attrs:{options:currencies.map(({code, name, symbol})=>({value:code, text:`${name} (${symbol})`}))}}
  , homeMessage: {Element:Input}
}

export const Settings =   connect(
    state => ({ config: getConfig(state), clients: getClients(state), state }),
    { storeConfig, restoreState }
  )((props) => {

    const { state, config, storeConfig, restoreState, clients } = props
    console.log('Settings',clients.length, state) // todo: remove log

    const downloadString = 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state))

    function onChangeRestore(e){
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

    return (
        <>
          <section>
            <h1 className="hide-low">Settings ({clients.length})</h1>
            {Object.entries(varMap).map(([key, {Element, attrs={}}], i)=>{
              const [value, setter] = useState(config[key])
              return <React.Fragment key={i}>
                <Label>{key} <Element value={value} setter={setter} {...attrs}></Element></Label>
              </React.Fragment>
            })}
          </section>
          <hr/>
          <section>
            <h2 className="col-12 col-sm-3">data</h2>
            <div className="col-12 col-sm-9">
              <ButtonAnchor href={downloadString} download={`data_${getDateString()}.json`}>download</ButtonAnchor>
              <ButtonLabel htmlFor="restore">restore</ButtonLabel>
              <input accept="application/json, text/json, .json" onChange={onChangeRestore} type="file" id="restore" className="visually-hidden"/>
              <Button onClick={()=>restoreState(defaultData)}>clear</Button>
              {/*dataExplain|full*/}
              <p>Everything you do in this application is saved to localStorage. You can backup this data by <em>downloading</em> a JSON file. You can use this file to <em>restore</em> the data on any other device or machine.<br/>
                When you <em>clear</em> the data it will be replaced by default data.</p>
            </div>
          </section>
        </>
    )
  })

