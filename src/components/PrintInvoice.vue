<template>
  <div>
    <div ref="shade" class="invoice-shade"><div></div></div>
    <div ref="iframeWrapper" class="iframe-wrapper">
      <iframe ref="iframe"></iframe>
    </div>
    <div ref="invoice" class="invoice print-invoice" :class="config.theme||''">
      <!--<link href='https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Istok+Web:400,400italic,700,700italic' rel='stylesheet' type='text/css'/>-->
      <!--<style>{{config.invoiceCSS}}</style>-->
      <link v-bind:href="fontsURI" rel='stylesheet' type='text/css'/>
      <!--############################################################-->
      <header>
        <div class="page">
          <div class="wrapper">
            <div class="client" v-html="parse('receiver')"></div>
            <div class="you">
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
import {appendStyle,cssVariablesChanged,cssCompiled} from '../model/css'
import {resize} from '../util/signal'

export default {
  name: 'PrintInvoice'
  ,props: ['client','project','invoice']
  ,data(){
    return {
      config: model.config
      ,isQuotation: false
      ,personal: model.personal
      ,contentHeight: 297
      ,resizeBind: null
    }
  }
  ,mounted(){
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
    appendStyle(this.$el.querySelector('.invoice'))
    cssVariablesChanged.add(settings=>this.config=settings||model.config)
    //
    Promise.all([
        new Promise(resolve=>cssCompiled.addOnce(resolve))
        ,this.populateIframe()
    ])
      .then(([css])=>{
        this.onCssCompiled(css)
        cssCompiled.add(this.onCssCompiled.bind(this))
        this.resizeBind = resize.add(this.onResize.bind(this))
      })
  }
  ,destroy(){
    this.resizeBind&&this.resizeBind.detach()
  }
  ,components: {
    Currency
  }
  ,methods: {
    /**
     * Popupate the iframe with the interpolated HTML and add the stylesheets
     * @returns {Promise}
     */
    populateIframe(){
      return new Promise(resolve=>{
        setTimeout(()=>{
          const {iframe,invoice} = this.$refs
          const {contentDocument} = iframe
          const contentBody = contentDocument.body
          //
          contentDocument.title = this.invoiceName
          //
          const html = invoice.outerHTML.replace(/print-invoice/,'')
          const styles = Array.from(document.querySelectorAll('style,link[rel=stylesheet]'))
              .filter(style=>/@page/.test(style.textContent)||style.getAttribute('id')==='invoiceCSS')
              .map(style=>style.outerHTML).join('')
          //
          contentBody.innerHTML = styles + html
          //
          this.contentHeight = contentDocument.body.offsetHeight
          this.onResize()
          //
          resolve()
          this.pageReady = true // todo to parent component
        })
      })
    }

    /**
     * Resize
     */
    ,onResize(w){
      const {shade,iframeWrapper,iframe} = this.$refs
      const height = this.contentHeight
      iframe.style.height = `${height}px`
      shade.children[0].style.height = `${height}px`
      iframeWrapper.style.height = `${(w>=598?0.6:0.4)*height}px`
    }

    /**
     * Inject custom CSS into iframe when sass has compiled
     * @param {string} css
     */
    ,onCssCompiled(css){
      const {iframe} = this.$refs
      const {contentDocument} = iframe
      if (contentDocument){
        contentDocument.getElementById('invoiceCSS').textContent = css
      }
      // todo: re-render image after css compilation
      // this.renderImage()
    }

    ,__

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

<style lang="scss">
  @import '../style/variables';
  @import '../style/print';
</style>

<style lang="scss" scoped>
  @import '../style/variables';
  $sizeS: 0.4;
  $sizeL: 0.6;
  $A4w: 210mm;
  $A4h: 297mm;
  $A4ws: $A4w*$sizeS;
  $A4wl: $A4w*$sizeL;
  $A4wsh: 0.5*$A4ws;
  $A4wlh: 0.5*$A4wl;
  .iframe-wrapper {
    position: relative;
    left: calc(50% - #{$A4wsh});
    width: $A4ws;
    overflow: hidden;
    @media #{$breakpointHigh} {
      width: $A4wl;
      left: calc(50% - #{$A4wlh});
    }
  }
  iframe {
    width: $A4w;
    border: 0;
    transform-origin: 0 0;
    transform: scale($sizeS);
    background-color: white;
    @media #{$breakpointHigh} { transform: scale($sizeL); }
  }
  .invoice-shade {
    position: relative;
    display: block;
    height: 0;
    zoom: $sizeS;
    @media #{$breakpointHigh} { zoom: $sizeL; }
    div {
      position: relative;
      left: 50%;
      width: $A4w;
      min-height: $A4h;
      transform: translateX(-50%);
      &:before, &:after {
        content: '';
        position: absolute;
        left: 7%; // 5%;
        top: 1%;
        width: 86%; // 90%;
        height: 98%;
        box-shadow: 4px 8px 64px rgba(0, 0, 0, 0.4);
      }
      &:before { transform: skewX(3deg); }
      &:after { transform: skewX(-3deg); }
    }
  }
  .print-invoice { display: none; }
</style>
