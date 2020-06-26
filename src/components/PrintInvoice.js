import React, {createRef, forwardRef, useState, useEffect, useCallback} from 'react'
import {getCSSVariables, nbsp} from '../util'
import styled from 'styled-components'
import {sass} from '../service/css'
import {project as enhanceProject} from '../model/clients/project'
import {getProjectNumber} from '../model/clients/selectors'
import {Parse as ParseUnbound} from './Parse'
import {T as TUnbound} from './T'
import print from '../config/print.css'

const A4w = 210
const A4h = 297
const colorDivider = '#1d85b4';
const dividerSize = '0.3%';
const dividerSize_ = '99.7%';
const dividerWidth = `${1.02*A4w}mm`

const px2mm = 0.2645833333
const pageHeightPx = A4h/px2mm

const scale = w=>px2mm*w/A4w

const Currency = ({children:val}) => {
  let dotValue = parseFloat(val||0).toFixed(2)
  const [before, after] = dotValue.split(/\./)
  const reg3 = /(\d)(?=(\d\d\d)+(?!\d))/g
  return <div symbol="€" className="mono">{`${before.replace(reg3, '$1.')},${after}`}</div>
}

const StyledPrintInvoice = styled.div`
  width: auto;
  .iframe-wrapper {
    position: relative;
    width: ${props => scale(props.width)*A4w}mm;
    height: ${props => scale(props.width)*props.pageHeight}px;
    overflow: hidden;
  }
  iframe, .invoice-shade, .page-dividers {
    width: ${A4w}mm;
    height: ${props => props.pageHeight}px;
    transform-origin: top left;
    transform: scale(${props => scale(props.width)});
  }
  iframe {
    min-height: ${A4h}mm;
    border: 0;
    background-color: white;
    overflow: hidden;
  }
  .invoice-shade {
    position: relative;
    /*z-index: 99;*/
    display: block;
    height: 0;
    div {
      position: relative;
      left: 50%;
      width: ${A4w}mm;
      min-height: ${A4h}mm;
      transform: translateX(-50%);
      &:before, &:after {
        content: '';
        position: absolute;
        left: 7%; // 4%; // 5%; //
        top: 1%;
        width: 86%; // 92%; // 90%; //
        height: 98%;
        box-shadow: 4px 8px 64px rgba(0, 0, 0, 0.4);
        background-color: rgba(0, 0, 0, 0.15);
      }
      &:before { transform: skewX(3deg); }
      &:after { transform: skewX(-3deg); }
    }
  }
  .page-dividers {
    position: relative;
    height: 0;
    div {
      position: relative;
      width: ${dividerWidth};
      height: ${A4h}mm;
      background: linear-gradient(${colorDivider} ${dividerSize}, transparent ${dividerSize});
      background-size: ${A4w}mm ${A4h}mm;
      transform: translateX(-${0.5*(1.02*A4w - A4w)}mm);
      &:before, &:after {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
        height: 100%;
        background-size: inherit;
      }
      &:first-child:before {
        content: '';
        background: linear-gradient(${colorDivider} ${dividerSize}, transparent ${dividerSize});
      }
      &:last-child:after {
        content: '';
        background: linear-gradient(transparent ${dividerSize_}, ${colorDivider} ${dividerSize_});
      }
    }
  }
  .print-invoice { display: none; }
`

export const PrintInvoice = forwardRef(({state, project, client, invoiceIndex, lang, ...attr}, ref) => {

  const {personal, config, config:{invoiceCSS, themeLogoCSS}} = state
  const isQuotation = invoiceIndex===-1

  const {discount, invoices} = project
  const invoice = invoiceIndex>=0&&invoices[invoiceIndex]

  const CSSVariables = getCSSVariables(config)

  const iframeRef = createRef()
  const invoiceRef = createRef()

  const fontsURI =  `https://fonts.googleapis.com/css?family=${config.themeFontMain}|${config.themeFontCurrency}`

  // rewire T to be bound to set language
  const T = ({children})=><TUnbound lang={lang}>{children}</TUnbound>

  // bind parser
  const Parse = ({children})=><ParseUnbound
    state={state}
    lang={lang}
    values={{ data:state.personal, project, client, invoice, lang }}
  >{children}</ParseUnbound>

  // copy invoice innerHTML to IFrame
  useEffect(()=>{
    const {current:{contentDocument, contentDocument:{body:contentBody}}} = iframeRef
    const {current:{outerHTML:html}} = invoiceRef
    contentDocument.title = getProjectNumber(project, state)
    contentBody.innerHTML = html.replace('visually-hidden', '')
    // todo calculatePagebreaks
  }, [invoiceRef, iframeRef, lang, invoiceIndex])

  // update IFrame CSS
  const [pageNum, setPageNum] = useState(1)
  const [pageHeight, setPageHeight] = useState(A4h)
  useEffect(()=>{
    const iframe = iframeRef.current
    const {contentDocument:{head, body}} = iframe
    const style = head.querySelector('style')||document.createElement('style')
    sass.compile(invoiceCSS)
        .then(css=>style.innerText = print+CSSVariables+themeLogoCSS+css)
    head.appendChild(style)
    setPageHeight(body.scrollHeight)
    setPageNum(Math.ceil(body.scrollHeight/pageHeightPx)) // not needed
  }, [iframeRef, invoiceCSS])

  // expose print method
  useEffect(()=>{
    const {current:{contentWindow}} = iframeRef
    ref.current.printInvoice = contentWindow.print.bind(contentWindow)
  }, [iframeRef])

  // force re-render to prevent iframe whiteout
  // const reRender = useState(0)[1]
  // useEffect(()=>{ setTimeout(reRender, 100) }, [])

  // page size/resize
  const getWidth = useCallback(()=>ref?.current?.offsetWidth||500, [ref])
  const [width, setWidth] = useState(getWidth)
  useEffect(()=>{
    let throttleID = -1
    const handleResize = ()=>{
      clearTimeout(throttleID)
      throttleID = setTimeout(()=>{
        setWidth(getWidth())
      }, 400)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [ref])

  ////////////////////////////////////
  ////////////////////////////////////
  ////////////////////////////////////

  project = enhanceProject(project)

  return <StyledPrintInvoice width={width} pageNum={pageNum} pageHeight={pageHeight} ref={ref} {...attr}>

    <div className="invoice-shade"><div /></div>

    <div className="page-dividers">
      <div v-for="pageHeight in pageBreaks">&nbsp;</div>
    </div>

    <div className="iframe-wrapper">
      <iframe title="a" ref={iframeRef} data-cy="printIframe" />
    </div>

    {/*############################################################*/}
    <div ref={invoiceRef} className={`invoice print-invoice visually-hidden ${config.theme||''}`} data-cy="iframePage">
      <link href={fontsURI} rel='stylesheet' type='text/css'/>
      <header>
        <div className="page">
          <div className="wrapper">
            <div className="client"><Parse>receiver</Parse></div>
            <div className="you">
              <div id="logo" />
              <div><Parse>sender</Parse></div>
            </div>
          </div>
        </div>
      </header>
      <div className="page">
        <div className="wrapper block clearfix">
          <dl className="float-right date">
            <dt><T>date</T>{nbsp}</dt>
            <dd>{isQuotation?project.quotationDate:invoice.date}</dd>{/*todo implement | date:copy.dateFormat[config.lang]*/}
          </dl>
          <dl className="list">
            <dt className="type">{isQuotation?<T>quotation</T>:(invoiceIndex>0?(invoice.exhortation?<T>exhortation</T>:[invoiceIndex, 'e ', <T key="1">reminder</T>]):<T>invoice</T>)}</dt>
            {!isQuotation&&<dd><T>number</T> {getProjectNumber(project, state)}</dd>}
          </dl>
          <dl className="list concerns">
            <dt><T>concerns</T></dt>
            <dd>{project.description}</dd>
          </dl>
          {invoiceIndex>0&&!invoice.interest&&<small><Parse>reminder1</Parse></small>}
          {invoiceIndex>0&&invoice.interest&&!invoice.exhortation&&<small><Parse>reminder2</Parse></small>}
          {invoiceIndex>0&&invoice.interest&&invoice.exhortation&&<small><Parse>exhortation_</Parse></small>}
        </div>
        {/*isQuotation*/}
        {isQuotation&&project.quotationBefore&&<div className="wrapper"><Parse>{project.quotationBefore}</Parse></div>}
        {/*isQuotation*/}
        <div className="wrapper">
          <h3 className="payment"><T>{isQuotation?'quotation':'payment'}</T></h3>
          <table cellSpacing="0" cellPadding="0">
            <thead>
            <tr>
              <th />
              <th><T>amount</T></th>
              <th><T>vat</T></th>
            </tr>
            </thead>

            {/*lines*/}
            <tbody>
              {project.lines.map((line, index)=><tr key={index}>
                <td>{line.description}</td>
                <td><Currency>{line.amount}</Currency></td>
                <td><Currency>{line.amount*line.vat/100}</Currency></td>
              </tr>)}
            </tbody>

            {/*subtotal*/}
            <tbody>
              {project.numLines>1&&<tr className="separate add"><td colSpan="3" /></tr>}
              {project.numLines>1&&<tr>
                <td><T>subtotal</T></td>
                <td><Currency>{project.total}</Currency></td>
                <td><Currency>{project.totalVat}</Currency></td>
              </tr>}
              {discount!==0&&<tr>
                <td><T>discount</T> {project.discount}%</td>
                <td><Currency>{-project.totalDiscount}</Currency></td>
                <td><Currency>{-project.totalVatDiscount}</Currency></td>
              </tr>}
            </tbody>

            {/*total*/}
            <tbody>
            {invoice.interest&&parseFloat(personal.administrationCosts||0)>0&&<tr>
              <td><T>administrationCosts</T></td>
              <td><Currency>{personal.administrationCosts}</Currency></td>
              <td />
            </tr>}
            {invoice.interest&&<tr>
              <td><T>legalInterest</T> {personal.interestAmount}%</td>
              <td><Currency>project.interest</Currency></td>
              <td />
            </tr>}
            <tr className="separate add"><td colSpan="3" /></tr>
            <tr className={{total:invoice.alreadyPaid===0}}>
              <td><T>total</T></td>
              <td colSpan="2"><Currency>{project.totalIncDiscounted}</Currency></td>
            </tr>
            </tbody>

            {/*already paid / remainder*/}
            {!isQuotation&&invoice.alreadyPaid!==0&&invoice.alreadyPaid!==undefined&&<tbody>
            <tr>
              <td><T>amountPaid</T></td>
              <td colSpan="2"><Currency>{invoice.alreadyPaid}</Currency></td>
            </tr>
            <tr className="separate subtract"><td colSpan="3" /></tr>
            <tr className="total">
              <td><T>remainder</T></td>
              <td colSpan="2"><Currency>{invoice.remainder}</Currency></td>
            </tr>
            </tbody>}

          </table>
        </div>
        {/*isQuotation*/}
        {isQuotation&&project.quotationAfter&&<div className="wrapper"><Parse>{project.quotationAfter}</Parse></div>}
        {/*isQuotation*/}
      </div>
      <footer className="wrapper">
        {!isQuotation&&<div className="page"><Parse>footer</Parse></div>}
      </footer>
    </div>

  </StyledPrintInvoice>
})
