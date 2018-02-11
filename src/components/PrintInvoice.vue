<template>
  <div class="invoice" :class="config.theme||''">
    <link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Istok+Web:400,400italic,700,700italic' rel='stylesheet' type='text/css'/>
    <!--<style>{{config.invoiceCSS}}</style>-->
    <header>
      <div class="page">
        <div class="wrapper block clearfix">
          <div class="float-left client" v-html="parse('receiver')"></div>
          <div class="float-right you">
            <div id="logo"></div>
            <div v-html="parse('sender')"></div>
          </div>
        </div>
      </div>
    </header>
    <div class="page">
      <div class="wrapper block clearfix">
        <dl class="float-right date">
          <dt>{{__('date')}}</dt>
          <dd>{{isQuotation?project.quotationDate:invoice.date}}</dd><!-- todo implement | date:copy.dateFormat[config.lang] -->
        </dl>
        <dl class="list">
          <dt class="type">{{isQuotation?__('quotation'):(invoice.invoiceIndex>0?invoice.exhortation?__('exhortation'):invoice.invoiceIndex+'e '+__('reminder'):__('invoice'))}}</dt>
          <dd v-if="!isQuotation">{{__('number')}} {{project.invoiceNr}}</dd>
        </dl>
        <dl class="list">
          <dt>{{__('concerns')}}</dt>
          <dd>{{project.description}}</dd>
        </dl>
        <small v-if="invoice.invoiceIndex>0&&!invoice.interest" v-html="parse('reminder1')"></small>
        <small v-if="invoice.invoiceIndex>0&&invoice.interest&&!invoice.exhortation" v-html="parse('reminder2')"></small>
        <small v-if="invoice.invoiceIndex>0&&invoice.interest&&invoice.exhortation" v-html="parse('exhortation_')"></small>
      </div>
      <!--isQuotation-->
      <div v-if="isQuotation" v-html="parse(project.quotationBefore)" class="wrapper"></div>
      <!--isQuotation-->
      <div class="wrapper">
        <h3 class="payment">{{__('payment')}}</h3>
        <table cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th></th>
            <th>{{__('amount')}}</th>
            <th>{{__('vat')}}</th>
          </tr>
          </thead>
          <!--lines-->
          <tbody>
          <tr v-for="line in project.lines">
            <td>{{line.description}}</td>
            <td><currency :value="line.amount" /></td>
            <td><currency :value="line.amount*line.vat/100" /></td>
          </tr>
          </tbody>
          <!--subtotal discount-->
          <tbody v-if="project.discount!==0">
          <tr class="separate add"><td colspan="3"></td></tr>
          <tr>
            <td>{{__('subtotal')}}</td>
            <td><currency :value="project.total" /></td>
            <td><currency :value="project.totalVat" /></td>
          </tr>
          <tr>
            <td>{{__('discount')}} {{project.discount}}%<!-- | number:2--></td>
            <td><currency :value="project.totalDiscount" /></td>
            <td><currency :value="project.totalVatDiscount" /></td>
          </tr>
          </tbody>
          <!--subtotal no discount-->
          <tbody v-if="project.discount===0&&project.lines.length>1">
          <tr class="separate add"><td colspan="3"></td></tr>
          <tr>
            <td>{{__('subtotal')}}</td>
            <td><currency :value="project.total" /></td>
            <td><currency :value="project.totalVat" /></td>
          </tr>
          </tbody>
          <!--total no interest-->
          <tbody v-if="!invoice.interest">
          <tr class="separate add">
            <td colspan="3"></td>
          </tr>
          <tr class="total">
            <td>{{__('total')}}</td>
            <td colspan="2"><currency :value="project.totalIncDiscounted" /></td>
          </tr>
          </tbody>
          <!--total interest-->
          <tbody v-if="invoice.interest">
          <tr>
            <td>{{__('administrationCosts')}}</td>
            <td><currency :value="personal.administrationCosts" /></td>
            <td></td>
          </tr>
          <tr>
            <td>{{__('legalInterest')}} {{personal.interestAmount}}%</td>
            <td><currency :value="project.interest" /></td>
            <td></td>
          </tr>
          <tr class="separate add"><td colspan="3"></td></tr>
          <tr class="total">
            <td>{{__('total')}}</td>
            <td colspan="2"><currency :value="project.totalIncDiscountedInterest" /></td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--isQuotation-->
      <div v-if="isQuotation" v-html="parse(project.quotationAfter)" class="wrapper"></div>
      <!--isQuotation-->
    </div>
    <footer class="wrapper">
      <div class="page" v-if="!isQuotation" v-html="parse(__('footer'))"></div>
    </footer>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency'
import {parse} from '@/util/interpolationService'
export default {
  name: 'PrintInvoice'
  ,props: ['client','project','invoice']
  ,data () {
    return {
      config: model.config
      ,isQuotation: false
      ,personal: model.personal
    }
  }
  ,mounted(){
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
    //
    const style = document.createElement('style') // todo: invoiceCSS (sass) needs to be compiled
    style.textContent = this.config.invoiceCSS
    this.$el.appendChild(style)
    //
  }
  ,components: {
    Currency
  }
  ,methods: {
    __(v){return v}
    ,parse(key){
      return parse(key,{
          client: this.client
          ,project: this.project
          ,invoice: this.invoice
          ,data: model.personal
      })
    }
  }
}
</script>

<style lang="scss" scped>
@import '/../variables';
@import '/../print';

/*
.invoice {
  width: 210mm;
  min-height: 296.9mm;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  !*background-color: var(--main-bg-color);*!
  background-color: white;
  overflow: hidden;
  margin: 0 auto;
  font-family: "Istok Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-print-color-adjust: exact;
  &.quotation {
    display: block;
    overflow: auto;
    height: auto;
  }
  > div {
    flex: 1;
  }
  header, footer {
    color: var(--secondary-fg-color);
    background-color: var(--secondary-bg-color);
  }
  header {
    padding-top: 20pt;
    margin-bottom: 30pt;
    font-size: 16pt;
    > * {
      z-index: 1;
    }
    .client {}
    .you { text-align: right; }
    p {
      margin: 0;
    }
    > canvas {
      zoom: 3;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 0;
    }
  }
  footer {
    flex: 0 1 63pt;
    padding: 0;
    font-size: 10pt;
    line-height: 140%;
    box-shadow: 0 10mm 0 0 var(--secondary-bg-color);
    text-align: center;
    div {
      padding-top: 8pt;
    }
  }

  h1 {
    margin: 0;
    font-size: 24pt;
    line-height: 120%;
  }
  h3.payment {
    //margin: 0;
  }

  h1, h2, h3, h4, h1 a, h2 a, h3 a, h4 a, th, label {
    color: inherit;
  }

  h3, h4, h5, h6 {
    margin: 60px 0 30px;
    & + br {
      display: none;
    }
    & + table {
      margin-top: 5mm;
      margin-bottom: 10mm;
    }
  }

  .page .wrapper:nth-child(2) {
    h3, h4, h5, h6 {
      &:first-child { margin-top: 0; }
    }
  }

  .type {
    text-transform: uppercase;
  }

  .client {
    color: var(--main-fg-color);
    max-width: 55%;
  }

  .date {
    text-align: right;
  }

  small {
    font-size: 80%;
    line-height: 140%;
  }
  small p {
    margin: 0;
  }

  .wrapper {
    position: relative;
    clear: both;
    width: 100%;
  }
  .block {
    padding: 10px 0 40px;
  }

  .page {
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  dl {
    display: block;
  }
  dt, dd {
    display: inline-block;
    margin: 0;
    vertical-align: top;
  }
  dl.list dt {
    width: 30%;
    font-weight: bold;
  }
  dl.list dd {
    width: 70%;
  }

  dl.main {
    margin-top: 10mm;
    font-size: 18px;
    font-weight: bold;
    dt {
      width: 15%;
    }
    dd {
      width: 85%;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: none;
    line-height: 160%;
    background-color: transparent!important;
    * { background-color: inherit!important; }
  }
  table tbody, table th, table td {
    border: 0;
  }
  th {
    &:nth-child(1) { width: 50%; }
    &:nth-child(2) { width: 25%; }
    &:nth-child(3) { width: 25%; }
  }
  tr.separate,
  tr.add {
    height: 10pt;
  }
  tr.separate td:before,
  tr.add td.line:before {
    content: '';
    display: block;
    width: 100%;
    height: .8pt;
    background-color: var(--secondary-bg-color);
  }
  tr.add td:last-child:after {
    content: '+';
    position: absolute;
    top: -2pt;
    right: -14pt;
    color: var(--secondary-bg-color);
  }
  td, th {
    padding-right: 16pt;
    &:first-child {
      padding-right: 0;
    }
  }
  !*app-currency {
    padding: 0 20px 0 140px;
  }*!
  .quotation tr.total td:last-child {
    padding-right: 15px;
  }
  th {
    font-size: 16px;
    text-align: right;
  }
  td {
    position: relative;
    !*border: 1px solid rgba(0,0,0,0.01);*!
  }
  app-currency {
    width: 80%;
    float: right;
    font-family: 'Droid Sans Mono', monospace;
  }
  .total {
    height: 40pt;
    app-currency {
      display: block;
      width: 55%;
      margin: 0 auto;
      float: none;
      transform: translateX(18pt);
      font-weight: bold;
      font-size: 20px;
      text-align: center;
    }
    td:last-child:before {
      left: 90px;
      position: static;
    }
    td:last-child:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: -8px;
      width: 95%;
      height: 100%;
      margin-left: 5%;
      border: 1px solid var(--secondary-bg-color);
      border-top: 0;
    }
  }

  .quotation-copy {
    margin-top: 20px;
    margin-bottom: 40px;
  }

  .avoid-break {
    page-break-inside: avoid;
  }
  .page-break {
    page-break-before: always;
    position: relative;
  }

  !* THEME CLEAN *!

  &.clean {
    header, footer {
      color: inherit;
      background-color: transparent;
    }
    header { border-bottom: 1px solid var(--secondary-bg-color); }
    footer { border-top: 1px solid var(--secondary-bg-color); }
  }

  !* THEME VERTICAL *!

  &.vertical {
    $barWidth: 200pt;
    .page {
      width: 100%;
      padding: 0 $barWidth 0 20pt;
    }
    header, footer {
      color: inherit;
      background-color: transparent;
    }
    header {
      &:before, &:after {
        content: '';
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
        background-color: var(--secondary-bg-color);
      }
      &:before {
        width: 0.2cm;
        left: 0;
      }
      &:after {
        width: $barWidth;
        right: 0;
      }
      .you {
        width: $barWidth;
        position: absolute;
        right: - $barWidth;
        text-align: left;
        color: var(--secondary-fg-color);
        font-size: 12pt;
        padding-left: 16pt;
      }
    }
    footer {
      flex: 0 1 83pt;
      padding-right: 16pt;
    }
    .date {
      padding-right: 16pt;
    }
    tr.add td:last-child:after {
      color: var(--secondary-fg-color);
    }
    .total {
      td:last-child {
        padding: 0;
        color: var(--secondary-fg-color);
        transform: translateX($barWidth);
        &:before, &:after { display: none; }
        app-currency { margin: 0; transform: none; }
      }
    }
  }
}
*/
</style>
