<template>
  <div>
    <div ref="shade" class="invoice-shade"><div></div></div>
    <div ref="pageDividers" class="page-dividers" v-bind:data-foo="pageBreaks.join(',')">
      <div v-for="pageHeight in pageBreaks" v-bind:style="`height:${pageHeight}px;`">&nbsp;</div>
    </div>
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
      ,signalBindings: []
      ,pageBreaks: [300]
    }
  }
  ,mounted(){
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
    appendStyle(this.$el.querySelector('.invoice'))
    this.signalBindings.push(cssVariablesChanged.add(settings=>this.config=settings||model.config))
    //
    Promise.all([
        new Promise(resolve=>{
          const binding = cssCompiled.addOnce(resolve)
          this.signalBindings.push(binding)
          return binding
        })
        ,this.populateIframe()
    ])
      .then(([css])=>{
        this.onCssCompiled(css)
        this.signalBindings.push(
            cssCompiled.add(this.onCssCompiled.bind(this))
            ,resize.add(this.onResize.bind(this))
        )
      })
  }
  ,beforeDestroy(){
    while (this.signalBindings.length) this.signalBindings.pop().detach()
  }
  ,watch: {
    'config.theme': function(newVal,oldVal){
      console.log('value changed from ' + oldVal + ' to ' + newVal)
      this.populateIframe()
    }
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
          contentDocument.title = this.project.invoiceNr
          //
          const html = invoice.outerHTML.replace(/print-invoice/,'')
          //
          // Because Webpack/Vue does not let us easily pump out separate stylesheets and because
          // dev styles differ from an actual build we've added `.html-print-start` and `.html-print-end`
          // to be able to determine the css applicable for print
          let printRules = []
          let printStarted = false
          Array.from(document.styleSheets).forEach(sheet=>{
            try { // CORS sucks
              Array.from(sheet.cssRules).forEach(rule=>{
                if (/^\.html-print-/.test(rule.cssText)){
                  printStarted =! printStarted
                } else {
                  printStarted&&printRules.push(rule.cssText)
                }
              })
            } catch (err){} // eslint-disable-line no-empty
          })
          const customStyle = document.getElementById('invoiceCSS')
          const styles = '<style>' + printRules.join('') + customStyle.textContent + '</style>'
          //
          contentBody.innerHTML = styles + html
          //
          this.onResize(resize.w)
          //
          this.calculatePagebreaks()
          //
          resolve()
          this.pageReady = true // todo to parent component
        })
      })
    }

    /**
     */
    ,calculatePagebreaks(){
        const {iframe} = this.$refs
        const {contentDocument} = iframe
        const contentBody = contentDocument.body
        this.pageBreaks = Array.from(contentBody.querySelectorAll('.page-break'))
            .map(elm=>elm.getBoundingClientRect().top)
            .concat([this.$refs.iframe.offsetHeight])
            .reverse()
            .map((v,i,a)=>i<a.length-1?v-a[i+1]:v)
            .reverse()
    }

    /**
     * Resize
     */
    ,onResize(w){
      const {shade,iframeWrapper,iframe} = this.$refs
      //
      const {contentDocument} = iframe
      const height = contentDocument&&contentDocument.querySelector('.invoice').offsetHeight||(297*3.779527559055)
      //
      iframe.style.height = shade.children[0].style.height = `${height}px`
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
      //
      setTimeout(this.onResize.bind(this,resize.w),200)
      //
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
    overflow: hidden;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    @media #{$breakpointHigh} { transform: scale($sizeL); }
  }
  .invoice-shade {
    position: relative;
    /*z-index: 99;*/
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
    $colorDivider: $colorBlue;
    $dividerSize: 0.3%;
    $dividerWidth: 1.02 * $A4w;
    position: relative;
    left: 50%;
    /*z-index: 2;*/
    width: $A4w;
    height: 0;
    transform: translateX(-50%);
    zoom: $sizeS;
    @media #{$breakpointHigh} { zoom: $sizeL; }
    div {
      position: relative;
      width: $dividerWidth;
      height: $A4h;
      //background: linear-gradient(transparent #{100%-$dividerSize}, $colorDivider #{100%-$dividerSize});
      background: linear-gradient($colorDivider $dividerSize, transparent $dividerSize);
      background-size: $A4w $A4h;
      transform: translateX(-#{0.5*($dividerWidth - $A4w)});
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
        background: linear-gradient($colorDivider $dividerSize, transparent $dividerSize);
      }
      &:last-child:after {
        content: '';
        background: linear-gradient(transparent #{100%-$dividerSize}, $colorDivider #{100%-$dividerSize});
      }
    }
  }
  .print-invoice { display: none; }
</style>
