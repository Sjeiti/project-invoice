import React, {useState, createRef, useEffect} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getConfig} from '../model/config/selectors'
import {storeConfig} from '../model/config/actions'
import {data} from '../model/default'
import {getFontList} from '../service/googleAPI'
import {saveable} from '../util/signal'
import {capitalise,getGetSetter,isEqual,noop} from '../util'
import {notify} from '../util/signal'
import {PrintInvoice} from '../components/PrintInvoice'
import {Button} from '../components/Button'
import {Label} from '../components/Label'
import {Select} from '../components/Select'
import {InputColor, InputRange} from '../components/Input'
import {Textarea} from '../components/Textarea'
import {T} from '../components/T'
import {ButtonLabel} from '../components/ButtonLabel'
import {FormSpan} from '../components/FormSpan'
import {DirtyPrompt} from '../components/DirtyPrompt'
import {ERROR} from '../components/Notification'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'
import {Page} from '../components/Page'

const StyledLayout = styled.section`
 
 /*.example {
   width: 210mm;
   min-height: 297mm;
   transform-origin: top left;
   transform: scale(0.5);
 }*/
 select { width: 70%; }
 textarea {
   width: 100%;
   height: 12rem;
   line-height: 160%;
   font-family: var(--font-mono);
 }
`

export const Layout = connect(
    state => ({ state, configOld: getConfig(state), session: getSession(state) })
    , {storeConfig, storeSession}
)(
  ({state, configOld, storeConfig, storeSession}) => {

    const client = data.clients[0]
    const project = client.projects[0]

    const [fakeState, setFakeState] = useState({...state, clients: [client]})
    const [config, setConfig] = useState(configOld)
    function reallySetConfig(newConfig){
    	setConfig(newConfig)
      setFakeState({...fakeState, config: newConfig })
    }
    const getSetter = getGetSetter(config, reallySetConfig)
    const setLogo = getSetter('themeLogoCSS')

    const [fontOptions, setFontOptions] = useState([])

    const isDirty = !isEqual(configOld, config)
    useEffect(()=>{
      requestAnimationFrame(()=>{
        storeSession({
          saveable: true
          , save: isDirty && storeConfig.bind(null, config) || null
          , revert: isDirty && (() => setConfig(configOld)) || null
          , deleet: null
        })
        console.log('useLocationEffect saveable',true) // todo: remove log
      })
    }, [isDirty, storeSession])
    // saveable.dispatch(
    //     true
    //     , isDirty && storeConfig.bind(null, config) || null
    //     , isDirty && (() => setConfig(configOld)) || null
    //     , null
    // )
    // useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])

    useEffect(()=>{
      getFontList(config.googleFontsAPIKey).then(
          result=>setFontOptions(result.map(font=>({text:font.family, value:font.family})))
          , ({message})=>notify.dispatch({message, type:ERROR})
      )
    }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

    const colorTypes = ['themeMainBgColor', 'themeMainFgColor', 'themeSecondaryBgColor', 'themeSecondaryFgColor']

    const invoiceTypes = ['quotation', 'invoice', 'reminder']
    const [invoiceIndex, setInvoiceIndex] = useState(0)

    const [lang, setLang] = useState(config.lang)

    const piRef = createRef()

    function onChangeLogo(e){
      const target = e.target // as HTMLInputElement
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsDataURL(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
        const img = document.createElement('img')
        img.addEventListener('load', onLogoLoad.bind(this, result, img))
        img.setAttribute('src', result)
        target.value = null
      })
    }
    function onLogoLoad(result, img){
      setLogo(result?`.invoice #logo {
          width: ${img.naturalWidth}px;
          height: ${img.naturalHeight}px;
          background-image: url(${result});
      }`:'')
    }

    return <Page saveable><StyledLayout>

      <header className="clearfix" style={{marginBottom:'1rem'}}>
        <h1><span className="hide-low"><T>layout</T> </span></h1>
      </header>

      <div className="row">

        <div className="col-12 col-sm-6">
          <Label>
            <T>theme</T>
            <Select
                value={config.theme}
                setter={getSetter('theme')}
                options={config.themes.map(k=>({text:k, value:k}))}
                data-cy="themeSelect"
            />
          </Label>

          <div>
            <FormSpan style={{width:'30%', display:'inline-block'}}><T>logo</T> </FormSpan>
            <ButtonLabel data-cy="addImage">add image<input accept="image/gif, image/jpg, image/jpeg, image/png, image/svg, .gif, .jpg, .jpeg, .png, .svg" type="file" onChange={onChangeLogo} className="visually-hidden"/></ButtonLabel>
            <Button onClick={()=>setLogo('')}><T>deleteImage</T></Button>
          </div>

          <h3><T>colors</T></h3>
          {colorTypes.map(
              key=><Label style={{maxWidth:'16rem'}} key={key}><T>{key}</T>
                <InputColor value={config[key]} setter={getSetter(key)} data-cy={key} />
              </Label>
          )}

          <h3><T>font</T></h3>
          <Label><T>baseFontSize</T><InputRange min="5" max="30" step="0.2" value={config.themeFontSize} setter={getSetter('themeFontSize')} data-cy="fontSizeInput" /></Label>
          <Label><T>mainFont</T><Select value={config.themeFontMain} setter={getSetter('themeFontMain')} options={fontOptions} data-cy="fontFamilyMainSelect" /></Label>
          <Label><T>currencyFont</T><Select value={config.themeFontCurrency} setter={getSetter('themeFontCurrency')} options={fontOptions} data-cy="fontFamilyCurrencySelect" /></Label>

          <h3><T>CSS</T></h3>
          <Textarea value={config.invoiceCSS} setter={getSetter('invoiceCSS')} data-cy="invoiceCSS" />
        </div>

        <div className="col-12 col-sm-6">
          <menu style={{marginBottom:'1rem'}}>
            {invoiceTypes.map((type, index)=><Button key={type} onClick={()=>setInvoiceIndex(index-1)} disabled={invoiceIndex===(index-1)} data-cy={`pageType${capitalise(type)}`}>{type}</Button>)}
            {config.langs.map(iso=><Button key={iso} onClick={()=>setLang(iso)} disabled={iso===lang} data-cy={`pageLang${capitalise(iso)}`}>{iso}</Button>)}
          </menu>
          <PrintInvoice
            className="example"
            ref={piRef}
            state={fakeState}
            client={client}
            project={project}
            invoiceIndex={invoiceIndex}
            lang={lang}
          />
        </div>

      </div>

      <DirtyPrompt when={isDirty} />

    </StyledLayout></Page>
  }
)

