<template>
  <div class="invoice" data-ngClass="{-{config.theme||''}}">
    <link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Istok+Web:400,400italic,700,700italic' rel='stylesheet' type='text/css'/>
    <!--<style>{{config.invoiceCSS}}</style>-->
    <header>
      <div class="page">
        <div class="wrapper block clearfix">
          <div class="float-left client" data-ngInnerHTML="parse('receiver') | safeHtml"></div>
          <div class="float-right you">
            <div id="logo"></div>
            <div data-ngInnerHTML="parse('sender') | safeHtml"></div>
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
        <small v-if="invoice.invoiceIndex>0&&!invoice.interest" data-ngInnerHTML="parse('reminder1') | safeHtml"></small>
        <small v-if="invoice.invoiceIndex>0&&invoice.interest&&!invoice.exhortation" data-ngInnerHTML="parse('reminder2') | safeHtml"></small>
        <small v-if="invoice.invoiceIndex>0&&invoice.interest&&invoice.exhortation" data-ngInnerHTML="parse('exhortation_') | safeHtml"></small>
      </div>
      <!--isQuotation-->
      <div v-if="isQuotation" data-ngInnerHTML="parse(project.quotationBefore) | safeHtml" class="wrapper"></div>
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
      <div v-if="isQuotation" data-ngInnerHTML="parse(project.quotationAfter) | safeHtml" class="wrapper"></div>
      <!--isQuotation-->
    </div>
    <footer class="wrapper">
      <div class="page" v-if="!isQuotation" data-ngInnerHTML="parse(__('footer'))"></div>
    </footer>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency'
export default {
  name: 'PrintInvoice'
  ,props: ['client','project','invoice']
  ,data () {
    return {
      config: {}
      ,isQuotation: false
      ,personal: {}
      
    }
  }
  ,mounted(){
    this.config = model.config
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
    this.personal = model.personal
  }
  ,components: {
    Currency
  }
  ,methods: {
    __: v=>v
  }
}
</script>

<!--<style lang="scss" scoped>
@import '/../variables';
footer {
  margin: 40px 0 0;
  padding: 4px 0;
  text-align: center;
  background-color: $colorHeader;
  box-shadow: 0 1px 0 1px $colorHeader;
  color: #fff;
}
</style>-->
