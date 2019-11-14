import React,{useState,createRef,useEffect} from 'react'
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
import {getGetSetter, isEqual} from '../utils'
import {saveable} from '../saveable'
import {getFontList} from '../service/googleAPI'

const StyledLayout = styled.section`
 
 .example {
   width: 210mm;
   min-height: 297mm;
   transform-origin: top left;
   transform: scale(0.5);
 }
`

export const Layout = connect(
    state => ({ state, configOld:getConfig(state) })
    ,{storeConfig}
)(
  ({state, configOld, storeConfig}) => {

    // console.log('configOld', configOld) // todo: remove log

    const [fakeState, setFakeState] = useState({...state})
    // const [config, setConfig] = useState(getConfig(fakeState))
    const [config, setConfig] = useState(configOld)
    function reallySetConfig(newConfig){
    	setConfig(newConfig)
      setFakeState({...fakeState, config: newConfig })
    }
    const getSetter = getGetSetter(config, reallySetConfig)
    // const getSetter = getGetSetter(config, setConfig)

    // const [fontList, setFontList] = useState([])
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
        // setFontList(result)
        setFontOptions(result.map(font=>({text:font.family,value:font.family})))
      })
    }, [])

    const client = data.clients[0]
    const project = client.projects[0]

    const colorTypes = ['themeMainBgColor', 'themeMainFgColor', 'themeSecondaryBgColor', 'themeSecondaryFgColor']

    const invoiceTypes = ['quotation', 'invoice', 'reminder']
    const [invoiceType, setInvoiceType] = useState('invoice')
    const invoiceIndex = 0

    const [lang, setLang] = useState(config.lang)

    const piRef = createRef()

    return <StyledLayout>

      <header className="clearfix" style={{marginBottom:'1rem'}}>
        <h1><span className="hide-low"><T>layout</T> </span></h1>
      </header>

      <div className="row">

      <div className="col-6">
        <Label><T>theme</T> <Select value={config.theme} setter={getSetter('theme')} options={config.themes.map(k=>({text:k, value:k}))} /></Label>
        <Label><T>logo</T> <span>
          <Button><T>addImage</T></Button>
          <Button onClick={()=>getSetter('themeLogoCSS')('')}><T>deleteImage</T></Button>
        </span></Label>
        <h3><T>colors</T></h3>
        {colorTypes.map(
            key=><Label key={key}><T>{key}</T>
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

      <div className="col-6">
        {invoiceTypes.map(type=><Button key={type} onClick={()=>setInvoiceType(type)} disabled={type===invoiceType}>{type}</Button>)}
        {config.langs.map(iso=><Button key={iso} onClick={()=>setLang(iso)} disabled={iso===lang}>{iso}</Button>)}
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

    </StyledLayout>
  }
)

