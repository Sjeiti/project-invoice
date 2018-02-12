<template>
  <div>
    <div class="invoice-shade"><div></div></div>
    <div class="invoice print-invoice" :class="config.theme||''">
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
  </div>
</template>

<script>
import Sass from 'sass.js/dist/sass.js'
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
    //
    //
    for (let s in Sass) console.log('s',s); // todo: remove log
    const sass = '.asdf{.qwer{color:#eee;}.zxcv{color:#fff;}}';
    this.sass = new Sass('/static/js/sass.worker.js')
    this.sass.compile(sass||this.config.invoiceCSS, this.onSassCompiled.bind(this))
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
    ,onSassCompiled(){
        console.log('onSassCompiled',arguments); // todo: remove log
    }
  }
}
</script>

<style lang="scss" scped>
@import '../variables';
@import '../print';

.invoice-shade {
  position: relative;
  display: block;
  height: 0;
  zoom: .399;
  /*@include media-breakpoint-up(sm) {
    zoom: .599;
  }*/
    zoom: .599;
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
  /*@include media-breakpoint-up(sm) {
    zoom: .6;
  }*/
    zoom: .6;
}
.invoice {
  position: relative;
  z-index: 1;
  width: 210mm;
  min-height: 296.9mm;
  font-family: "Istok Web","Helvetica Neue",Helvetica,Arial,sans-serif;
}
</style>
