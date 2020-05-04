import React, {useState, createRef, useEffect} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {getConfig} from '../model/config/selectors'
import {storeConfig} from '../model/config/actions'
import {PrintInvoice} from '../components/PrintInvoice'
import {Button} from '../components/Button'
import {Label} from '../components/Label'
import {Select} from '../components/Select'
import {InputColor, InputRange} from '../components/Input'
import {Textarea} from '../components/Textarea'
import {T} from '../components/T'
import {data} from '../model/default'
import {getGetSetter, isEqual} from '../util'
import {saveable} from '../util/signal'
import {getFontList} from '../service/googleAPI'
import {ButtonLabel} from '../components/ButtonLabel'
import {FormSpan} from '../components/FormSpan'
import {DirtyPrompt} from '../components/DirtyPrompt'

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
    state => ({ state, configOld: getConfig(state) })
    , {storeConfig}
)(
  ({state, configOld, storeConfig}) => {

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
    saveable.dispatch(
        true
        , isDirty && storeConfig.bind(null, config) || null
        , isDirty && (() => setConfig(configOld)) || null
        , null
    )
    useEffect(()=>{setTimeout(()=>saveable.dispatch(true))}, [])

    // todo move to service and cache, or at least memoize
    useEffect(()=>{
      getFontList(config.googleFontsAPIKey).then(result=>{
        setFontOptions(result.map(font=>({text:font.family, value:font.family})))
      })
      // requestAnimationFrame(()=>setFontOptions(fontOptions))
      // setTimeout(()=>setConfig(config), 12140)
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

    return <StyledLayout>

      <header className="clearfix" style={{marginBottom:'1rem'}}>
        <h1><span className="hide-low"><T>layout</T> </span></h1>
      </header>

      <div className="row">

        <div className="col-12 col-sm-6">
          <Label><T>theme</T> <Select value={config.theme} setter={getSetter('theme')} options={config.themes.map(k=>({text:k, value:k}))} /></Label>

          <div>
            <FormSpan style={{width:'30%', display:'inline-block'}}><T>logo</T> </FormSpan>
            <ButtonLabel>add image<input accept="image/gif, image/jpg, image/jpeg, image/png, image/svg, .gif, .jpg, .jpeg, .png, .svg" type="file" onChange={onChangeLogo} className="visually-hidden"/></ButtonLabel>
            <Button onClick={()=>setLogo('')}><T>deleteImage</T></Button>
          </div>

          <h3><T>colors</T></h3>
          {colorTypes.map(
              key=><Label style={{maxWidth:'16rem'}} key={key}><T>{key}</T>
                <InputColor value={config[key]} setter={getSetter(key)} />
              </Label>
          )}

          <h3><T>font</T></h3>
          <Label><T>baseFontSize</T><InputRange min="5" max="30" step="0.2" value={config.themeFontSize} setter={getSetter('themeFontSize')} /></Label>
          <Label><T>mainFont</T><Select value={config.themeFontMain} setter={getSetter('themeFontMain')} options={fontOptions}/></Label>
          <Label><T>currencyFont</T><Select value={config.themeFontCurrency} setter={getSetter('themeFontCurrency')} options={fontOptions}/></Label>

          <h3><T>CSS</T></h3>
          <Textarea value={config.invoiceCSS} setter={getSetter('invoiceCSS')} />
        </div>

        <div className="col-12 col-sm-6">
          <menu style={{marginBottom:'1rem'}}>
            {invoiceTypes.map((type, index)=><Button key={type} onClick={()=>setInvoiceIndex(index-1)} disabled={invoiceIndex===(index-1)}>{type}</Button>)}
            {config.langs.map(iso=><Button key={iso} onClick={()=>setLang(iso)} disabled={iso===lang}>{iso}</Button>)}
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

    </StyledLayout>
  }
)

