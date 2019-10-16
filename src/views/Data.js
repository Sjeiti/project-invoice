import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {isEqual} from '../utils'
import {saveable} from '../saveable'
import {getData} from '../model/personal/selectors'
import {storeData} from '../model/personal/actions'
import {Label} from '../components/Label'
import {Input} from '../components/Input'
import {T} from '../components/T'

export const Data = connect(
  state => ({ data: getData(state) })
  , {storeData}
)(({data, storeData}) => {

  const editableProps = Object.entries(data).map(([key, value])=>[key, ...useState(value)])
  const newData = editableProps.reduce((acc, [key, value])=>(acc[key] = value, acc), {})

  const isDirty = !isEqual(data, newData)
  const revert = isDirty && (() => editableProps.forEach(([key, val, set]) => set(data[key]))) || null
  const save = isDirty && storeData.bind(null, newData) || null
  saveable.dispatch(true, save, revert, null)
  useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])

  return <>
    <h1><T>data</T></h1>
    {editableProps.map(([key, value, setter])=>
        <Label key={key}>
          <T>{key}</T>
          <Input value={value} setter={setter} />
        </Label>
    )}
  </>
})
