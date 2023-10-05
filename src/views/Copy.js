import React, {useEffect, useState, createRef} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {isEqual, getGetSetter, getInterpolationContext} from '../util'
import {saveable} from '../util/signal'
import {getCopy} from '../model/copy/selectors'
import {storeCopy} from '../model/copy/actions'
import {getConfig} from '../model/config/selectors'
import {data} from '../model/default'
import {Label} from '../components/Label'
import {Button, IconButton} from '../components/Button'
import {T} from '../components/T'
import {InterpolationInput} from '../components/InterpolationInput'
import {DirtyPrompt} from '../components/DirtyPrompt'
import {InputText} from '../components/Input'
import {Page} from '../components/Page'
import i18next from 'i18next'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'
// import {useKeyDown} from '../hook/useKeyDown'

const CopyLabelStyled = styled(Label)`
  >.input {
    position: relative;
    button:first-child {
      position: absolute;
      right: 0;
      top: 0;
      margin: 0;
      +.input {
        padding-right: 2rem;
      }
    }
    >textarea {
      position: relative;
      z-index: 1;
    }
  }
`

const CopyLabels = ({list, getSetter, context, lang, custom, onClickDeleteCopy, ...attr})=><>
    {list.map(([key, value])=>
        <CopyLabelStyled key={key} {...attr}>
          {custom?key:<T>{key}</T>}
          <div className="input">
            {custom&&<IconButton type="close" onClick={onClickDeleteCopy.bind(null, key)} />}
            <InterpolationInput
                multiline
                context={context}
                value={value[lang]}
                setter={val=>{
                  const newVal = {...value}
                  newVal[lang] = val
                  getSetter(key)(newVal)
                }}
            />
          </div>
        </CopyLabelStyled>
    )}
</>

export const Copy = connect(
  state => ({ state, copyOld: getCopy(state), config: getConfig(state), session: getSession(state) })
  , {storeCopy, storeSession}
)(({state, copyOld, config, storeCopy, storeSession}) => {

  const [copy, setCopy] = useState(copyOld)
  const getSetter = getGetSetter(copy, setCopy)

  const [lang, setLang] = useState(config.lang)

  const [key, setKey] = useState('')

  const isDirty = !isEqual(copyOld, copy)
  useEffect(()=>{
    storeSession({
      saveable: true
      , save: isDirty && storeCopy.bind(null, copy) || null
      , revert: isDirty && (() => setCopy(copyOld)) || null
      , deleet: null
    })
  }, [isDirty, storeSession])
  // saveable.dispatch(
  //     true
  //     , isDirty && storeCopy.bind(null, copy) || null
  //     , isDirty && (() => setCopy(copyOld)) || null
  //     , null
  // )
  // useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])

  const keyInput = createRef()

  const [context] = useState(getInterpolationContext(state))

  const copyLabelAttr = {
    getSetter
    , context
    , lang
    , onClickDeleteCopy
  }

  function onClickDeleteCopy(key){
    const newCopy = {...copy}
    delete newCopy[key]
    setCopy(newCopy)
  }

  function onClickAddCopy(){
    const keyExists = copy.hasOwnProperty(key)
    if (!key) {
      keyInput.current.focus()
    } else if (!keyExists) {
      const newCopy = {...copy}
      newCopy[key] = config.langs.reduce((acc, key)=>(acc[key]='', acc), {})
      setCopy(newCopy)
      setKey('')
    }
  }

  function onAddKeyPress(e){
    e.key==='Enter'&&onClickAddCopy()
  }

  const defaultKeys = Object.keys(data.copy)
  const copyDefault = []
  const copyCustom = []
  Object.entries(copy).forEach(([key, value])=>{
    (defaultKeys.includes(key)&&copyDefault||copyCustom).push([key, value])
  })

  return <Page saveable>
    <div className="float-right" data-cy="languages">
      {config.langs.map(iso=><Button key={iso} onClick={setLang.bind(null, iso)} disabled={iso===lang}>{iso}</Button>)}
    </div>
    <h1><T>copy</T></h1>

    <CopyLabels list={copyDefault} {...copyLabelAttr} />
    <hr/>
    <CopyLabels list={copyCustom} {...copyLabelAttr} custom={true} />

    <div className="float-right" style={{marginTop:'1rem'}}>
      <InputText value={key} setter={setKey} onKeyPress={onAddKeyPress} ref={keyInput} />
      <Button onClick={onClickAddCopy}>Add copy</Button>
    </div>
    <DirtyPrompt when={isDirty} />
  </Page>
})
