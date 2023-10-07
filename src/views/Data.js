import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {isEqual, getGetSetter} from '../util'
import {getData} from '../model/personal/selectors'
import {storeData} from '../model/personal/actions'
import {Label} from '../components/Label'
import {InputText} from '../components/Input'
import {T} from '../components/T'
import {DirtyPrompt} from '../components/DirtyPrompt'
import {Page} from '../components/Page'
import {getSession} from '../model/session/selectors'
import {storeSaveableFunctions} from '../model/session/actions'

export const Data = connect(
  state => ({ dataOld: getData(state), session: getSession(state) })
  , {storeData, storeSaveableFunctions}
)(({dataOld, storeData, storeSaveableFunctions}) => {

  const [data, setData] = useState(dataOld)
  const getSetter = getGetSetter(data, setData)

  const isDirty = !isEqual(dataOld, data)
  useEffect(()=>{
    requestAnimationFrame(()=>{
      storeSaveableFunctions(
        isDirty && storeData.bind(null, data) || null
        , isDirty && (() => setData(dataOld)) || null
      )
    })
  }, [isDirty, storeSaveableFunctions])


  return <Page saveable>
    <h1><T>data</T></h1>
    {Object.entries(data).map(([key, value])=>
        <Label key={key}>
          <T>{key}</T>
          <InputText value={value} setter={getSetter(key)} />
        </Label>
    )}
    <DirtyPrompt when={isDirty} />
  </Page>
})
