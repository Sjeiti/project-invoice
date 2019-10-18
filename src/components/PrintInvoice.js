import React, {useState, createRef, forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {breakpoint} from '../cssService'
import {T} from './T'

import print from '../../temp/print.css'
import {getProjectNumber} from '../model/clients/selectors'
const style = document.createElement('style')
style.textContent = print
document.body.appendChild(style)

const {breakpointHigh} = breakpoint

const sizeS = 0.4
const sizeL = 0.6
const A4w_ = 210
const A4h_ = 297
const A4ws = A4w_*sizeS
const A4wl = A4w_*sizeL
const A4wsh = 0.5*A4ws
const A4wlh = 0.5*A4wl
const A4w = `${A4w_}mm`
const A4h = `${A4h_}mm`
const colorDivider = '#1d85b4';
const dividerSize = '0.3%';
const dividerSize_ = '99.7%';
const dividerWidth = `${1.02*A4w_}mm`

const Parse = styled.span`` // todo write parser
const Currency = styled.span`` // todo write currency

const StyledPrintInvoice = styled.div`

  .iframe-wrapper {
    position: relative;
    left: calc(50% -${A4wsh});
    width: ${A4ws};
    overflow: hidden;
    @media ${breakpointHigh} {
      width: ${A4wl};
      left: calc(50% - ${A4wlh});
    }
  }
  iframe {
    width: ${A4w};
    border: 0;
    transform-origin: 0 0;
    transform: scale(${sizeS});
    background-color: white;
    overflow: hidden;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    @media ${breakpointHigh} { transform: scale(${sizeL}); }
  }
  .invoice-shade {
    position: relative;
    /*z-index: 99;*/
    display: block;
    height: 0;
    zoom: ${sizeS};
    @media ${breakpointHigh} { zoom: ${sizeL}; }
    div {
      position: relative;
      left: 50%;
      width: ${A4w};
      min-height: ${A4h};
      transform: translateX(-50%);
      &:before, &:after {
        content: '';
        position: absolute;
        left: 4%; // 7%; // 5%; //
        top: 1%;
        width: 92%; // 86%; // 90%; //
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
    left: 50%;
    /*z-index: 2;*/
    width: ${A4w};
    height: 0;
    transform: translateX(-50%);
    zoom: ${sizeS};
    @media #{$breakpointHigh} { zoom: ${sizeL}; }
    div {
      position: relative;
      width: ${dividerWidth};
      height: ${A4h};
      //background: linear-gradient(transparent #{100%-$dividerSize}, $colorDivider #{100%-$dividerSize});
      background: linear-gradient(${colorDivider} ${dividerSize}, transparent ${dividerSize});
      background-size: ${A4w }${A4h};
      //transform: translateX(-#{0.5*($dividerWidth - $A4w)});
      transform: translateX(-${0.5*(1.02*A4w_ - A4w_)}mm);
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

export const PrintInvoice = forwardRef(({state, project, client, invoiceIndex}, ref) => {
  const {personal} = state
  const isQuotation = invoiceIndex===-1

  const {discount, invoices} = project
  const invoice = invoiceIndex>=0&&invoices[invoiceIndex]

  const iframeRef = createRef()
  const invoiceRef = createRef()

  useEffect(()=>{
    const {current:{contentWindow, contentDocument, contentDocument:{body:contentBody}}} = iframeRef
    const {current:{outerHTML:html}} = invoiceRef
    contentDocument.title = getProjectNumber(project, state)
    contentBody.innerHTML = `<style>${print}</style>` + html
    // todo onResize
    // todo calculatePagebreaks
    // expose print method
    ref.current.printInvoice = contentWindow.print.bind(contentWindow)

  })

  return <StyledPrintInvoice ref={ref}>
    <div xref="shade" className="invoice-shade"><div></div><div></div></div>

    <div xref="pageDividers" className="page-dividers" v-bind-data-foo="pageBreaks.join(',')">
      <div v-for="pageHeight in pageBreaks" v-bind-style="`height:${pageHeight}px;`">&nbsp;</div>
    </div>

    <div xref="iframeWrapper" className="iframe-wrapper">
      <iframe ref={iframeRef}></iframe>
    </div>

    <div ref={invoiceRef} className="invoice print-invoice" className="config.theme||''">
      {/*<link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Istok+Web:400,400italic,700,700italic' rel='stylesheet' type='text/css'/>*/}
      {/*<style>{{config.invoiceCSS}}</style>*/}
      <link v-bind-href="fontsURI" rel='stylesheet' type='text/css'/>
      {/*############################################################*/}
      <header>
        <div className="page">
          <div className="wrapper">
            <div className="client" v-html="parse('receiver')" />
            <div className="you">
              <div id="logo" />
              <div v-html="parse('sender')" />
            </div>
          </div>
        </div>
      </header>
      <div className="page">
        <div className="wrapper block clearfix">
          <dl className="float-right date">
            <dt><T>date</T> </dt>
            <dd>{isQuotation?project.quotationDate:invoice.date}</dd>{/*todo implement | date:copy.dateFormat[config.lang]*/}
          </dl>
          <dl className="list">
            <dt className="type">{isQuotation?<T>quotation</T>:(invoice.invoiceIndex>0?invoice.exhortation?<T>exhortation</T>:invoice.invoiceIndex+'e '+<T>reminder</T>:<T>invoice</T>)}</dt>
            {isQuotation&&<dd><T>number</T> {project.invoiceNr}</dd>}
          </dl>
          <dl className="list concerns">
            <dt><T>concerns</T></dt>
            <dd>{project.description}</dd>
          </dl>
          {invoice.invoiceIndex>0&&!invoice.interest&&<small><Parse>reminder1</Parse></small>}
          {invoice.invoiceIndex>0&&invoice.interest&&!invoice.exhortation&&<small><Parse>reminder2</Parse></small>}
          {invoice.invoiceIndex>0&&invoice.interest&&invoice.exhortation&&<small><Parse>exhortation_</Parse></small>}
        </div>
        {/*isQuotation*/}
        {isQuotation&&<div className="wrapper"><Parse>{project.quotationBefore}</Parse></div>}
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
              <td colSpan="2"><Currency>project.totalIncDiscounted</Currency></td>
            </tr>
            </tbody>

            {/*already paid / remainder*/}
            {!isQuotation&&invoice.alreadyPaid!==0&&invoice.alreadyPaid!==undefined&&<tbody>
            <tr>
              <td><T>amountPaid</T></td>
              <td colSpan="2"><Currency>invoice.alreadyPaid</Currency></td>
            </tr>
            <tr className="separate subtract"><td colSpan="3" /></tr>
            <tr className="total">
              <td><T>remainder</T></td>
              <td colSpan="2"><Currency>invoice.remainder</Currency></td>
            </tr>
            </tbody>}

          </table>
        </div>
        {/*isQuotation*/}
        {isQuotation&&<div className="wrapper"><Parse>{project.quotationAfter}</Parse></div>}
        {/*isQuotation*/}
      </div>
      <footer className="wrapper">
        {!isQuotation&&<div className="page"><Parse>footer</Parse></div>}
      </footer>
    </div>

  </StyledPrintInvoice>
}
)