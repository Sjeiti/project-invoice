import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {isEqual, getGetSetter} from '../util'
import {saveable} from '../util/signal'
import {getData} from '../model/personal/selectors'
import {storeData} from '../model/personal/actions'
import {Label} from '../components/Label'
import {InputText} from '../components/Input'
import {T} from '../components/T'
import {DirtyPrompt} from '../components/DirtyPrompt'

export const Data = connect(
  state => ({ dataOld: getData(state) })
  , {storeData}
)(({dataOld, storeData}) => {

  const [data, setData] = useState(dataOld)
  const getSetter = getGetSetter(data, setData)

  const isDirty = !isEqual(dataOld, data)
  saveable.dispatch(
      true
      , isDirty && storeData.bind(null, data) || null
      , isDirty && (() => setData(dataOld)) || null
      , null
  )
  useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])


  return <>
    <h1><T>data</T></h1>
    {Object.entries(data).map(([key, value])=>
        <Label key={key}>
          <T>{key}</T>
          <InputText value={value} setter={getSetter(key)} />
        </Label>
    )}
    <DirtyPrompt when={isDirty} />
  </>
})
