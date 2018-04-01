<template>
  <div>
    <div class="invoice-shade"><div></div></div>
    <div class="invoice print-invoice" :class="config.theme||''">
      <!--<link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Istok+Web:400,400italic,700,700italic' rel='stylesheet' type='text/css'/>-->
      <!--<style>{{config.invoiceCSS}}</style>-->
      <link v-bind:href="fontsURI" rel='stylesheet' type='text/css'/>
      <!--############################################################-->
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
          <dl class="list concerns">
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
          <h3 class="payment">{{__(isQuotation?'quotation':'payment')}}</h3>
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
        <div class="page" v-if="!isQuotation" v-html="parse('footer')"></div>
      </footer>
    </div>
  </div>
</template>

<script>
import model from '../model'
import Currency from '../components/Currency'
import {parse,__} from '../service/interpolationService'
import {appendStyle,cssVariablesChanged} from '../model/css'

export default {
  name: 'PrintInvoice'
  ,props: ['client','project','invoice']
  ,data(){
    return {
      config: model.config
      ,isQuotation: false
      ,personal: model.personal
    }
  }
  ,mounted(){
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
    appendStyle(this.$el.querySelector('.invoice'))
    cssVariablesChanged.add(settings=>this.config=settings||model.config)
  }
  ,components: {
    Currency
  }
  ,methods: {
    __
    /**
     * Wrapper for interpolationService.parse to add client, project and invoice
     * @param {string} key
     * @returns {string}
     */
    ,parse(key){
      model.copy[key]&&(key = `$\{copy.${key}}`)
      return parse(key,{
          client: this.client
          ,project: this.project
          ,invoice: this.invoice
      })
    }
  }
  ,computed: {
    fontsURI(){
      return `https://fonts.googleapis.com/css?family=${this.config.themeFontMain}|${this.config.themeFontCurrency}`
    }
  }
}
</script>

<style lang="scss" scped>
@import '../style/variables';
@import '../style/print';

.invoice-shade {
  position: relative;
  display: block;
  height: 0;
  zoom: .399;
  @media #{$breakpointHigh} { zoom: .599; }
  div {
    position: relative;
    left: 50%;
    width: 210mm;
    min-height: 296.9mm;
    transform: translateX(-50%);
    &:before, &:after {
      content: '';
      position: absolute;
      left: 4%;
      top: 1%;
      width: 92%;
      height: 98%;
      box-shadow: 4px 8px 64px rgba(0, 0, 0, 0.4);
    }
    &:before {
      transform: skewX(3deg);
    }
    &:after {
      transform: skewX(-3deg);
    }
  }
}
.print-invoice {
  /*display: block;*/
  width: 210mm;
  min-height: 296.9mm;
  margin: 0 auto 60px;
  position: relative;
  z-index: 1;
  zoom: .4;
  font-family: "Istok Web","Helvetica Neue",Helvetica,Arial,sans-serif;
  @media #{$breakpointHigh} { zoom: .6; }
}
.invoice {
  position: relative;
  z-index: 1;
  width: 210mm;
  min-height: 296.9mm;
  font-family: "Istok Web","Helvetica Neue",Helvetica,Arial,sans-serif;
}
.page-break{
  position: relative;
  left: -10%;
  display: block;
  width: 120%;
  height: 0;
  border-top: 2px dashed $colorGrayLight;
  /*&:after{
    content: '';
    position: absolute;
    left: 0;
    top: 297mm;
    display: block;
    width: 100%;
    height: 0;
    border-top: 2px dashed #EEE;
  }*/
}
</style>
