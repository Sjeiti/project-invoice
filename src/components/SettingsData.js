import React from 'react'
import {Button} from './Button'
import {getDateString} from '../util'
import {T} from './T'
import {ButtonAnchor} from './ButtonAnchor'
import {ButtonLabel} from './ButtonLabel'
import {data as defaultData} from '../model/default'
import {notify} from '../util/signal'
import {ERROR} from './Notification'
import {validateRaw} from '../model/validate'

export const SettingsData = ({state, restore}) => {

  const downloadString = 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(state))

  return <>
    <ButtonAnchor href={downloadString} download={`data_${getDateString()}.json`} data-cy="download"><T>download</T></ButtonAnchor>
    <ButtonLabel htmlFor="restore" data-cy="restore"><T>restore</T></ButtonLabel>
    <input accept="application/json, text/json, .json" onChange={onChangeRestore.bind(null, restore)} type="file" id="restore" className="visually-hidden" data-cy="inputFile" />
    <Button onClick={()=>restore(defaultData)} data-cy="clear"><T>clear</T></Button>
  </>
}

function onChangeRestore(restore, e){
  const target = e.target
  const fileReader = new FileReader()
  const file = target.files[0]
  fileReader.readAsText(file)
  fileReader.addEventListener('load', ()=>{
    validateRaw(fileReader.result).then(restore, error)
  })
}

function error(message){
	notify.dispatch({message, type: ERROR})
}
