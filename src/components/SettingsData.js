import React from 'react'
import {Button} from './Button'
import {getDateString, tryParse} from '../util'
import {T} from './T'
import {ButtonAnchor} from './ButtonAnchor'
import {ButtonLabel} from './ButtonLabel'
import {data as defaultData} from '../model/default'
import {notify} from '../util/signal'
import {ERROR} from './Notification'

export const SettingsData = ({state, restoreState}) => {

  const downloadString = 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state))

  return <>
    <ButtonAnchor href={downloadString} download={`data_${getDateString()}.json`}><T>download</T></ButtonAnchor>
    <ButtonLabel htmlFor="restore"><T>restore</T></ButtonLabel>
    <input accept="application/json, text/json, .json" onChange={onChangeRestore.bind(null,restoreState)} type="file" id="restore" className="visually-hidden"/>
    <Button onClick={()=>restoreState(defaultData)}><T>clear</T></Button>
  </>
}

function onChangeRestore(restoreState, e){
  const target = e.target
  const fileReader = new FileReader()
  const file = target.files[0]
  fileReader.readAsText(file)
  fileReader.addEventListener('load', ()=>{
    const result = fileReader.result
    const resultData = tryParse(result) // todo decryptAndOrParse
    if (resultData&&resultData.clients&&resultData.copy&&resultData.personal){
      restoreState(resultData)
    } else if (!resultData) {
      error('Malformed JSON data.')
    } else {
      error('The JSON is missing data specific to Project Invoice.')
    }
  })
}

function error(message){
	notify.dispatch({message, type: ERROR})
}