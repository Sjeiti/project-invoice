import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {isEqual, getGetSetter, getInterpolationContext} from '../util'
import {saveable} from '../util/signal'
import {getCopy} from '../model/copy/selectors'
import {storeCopy} from '../model/copy/actions'
import {getConfig} from '../model/config/selectors'
import {Label} from '../components/Label'
import {Button} from '../components/Button'
import {T} from '../components/T'
import {InterpolationInput} from '../components/InterpolationInput'

export const Copy = connect(
  state => ({ state, copyOld: getCopy(state), config: getConfig(state) })
  , {storeCopy}
)(({state, copyOld, config, storeCopy}) => {

  const [copy, setCopy] = useState(copyOld)
  const getSetter = getGetSetter(copy, setCopy)

  const [lang, setLang] = useState(config.lang)

  const isDirty = !isEqual(copyOld, copy)
  saveable.dispatch(
      true
      , isDirty && storeCopy.bind(null, copy) || null
      , isDirty && (() => setCopy(copyOld)) || null
      , null
  )
  useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])

  const context = getInterpolationContext(state)

  return <>
    <div className="float-right">
      {config.langs.map(iso=><Button key={iso} onClick={setLang.bind(null, iso)} disabled={iso===lang}>{iso}</Button>)}
    </div>
    <h1><T>copy</T></h1>

    <header className="row no-gutters">
      <strong className="col-4"><T>key</T></strong>
      <strong className="col-4"><T>value</T></strong>
    </header>
    {Object.entries(copy).map(([key, value])=>
        <Label key={key}>
          <T>{key}</T>
          <InterpolationInput
              multiline
              context={context}
              value={value[lang]}
              setter={val=>{
                const newVal = {...value}
                newVal[lang] = val
                getSetter(key)(newVal)
              }} />
        </Label>
    )}
  </>
})
