<template>
  <section>
    <header>
      <h1>Invoice {{project.invoiceNr}}</h1>
      <div class="invoice-options">
        <router-link v-bind:to="project.uri||''" class="btn">back</router-link>
        <button v-on:click="onClickPrint()"
                v-bind:disabled="!pageReady">print</button>
        <a data-ngClick="onClickDownload($event)"
           class="btn"
           data-ngClass="{disabled:!pageReady}"
           data-href="{-{dataUrl}}"
           download="{-{invoiceName}}.png">download</a>
      </div>
      <lang></lang>
    </header>
    <print-invoice :client="client" :project="project" :invoice="invoice" />
  <iframe class="visually-hidden"></iframe>
  </section>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency.vue'
import Lang from '@/components/Lang.vue'
import PrintInvoice from '@/components/PrintInvoice.vue'
import signals from '@/signals'
import {cssCompiled} from '@/model/css'

export default {
  name: 'invoice'
  ,data () {
    return {
      client:{}
      ,project:{}
      ,invoice:{}
      ,pageReady:false
    }
  }
  ,components: {
    Currency
    ,Lang
    ,PrintInvoice
  }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    this.project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
    this.invoice = this.project.invoices[0] // todo implement
    //
    Promise.all([
        new Promise(resolve=>cssCompiled.addOnce(resolve))
        ,this.populateIframe()
    ])
      .then(([css])=>{
        this.onCssCompiled(css)
        cssCompiled.add(this.onCssCompiled.bind(this))
      })
  }
  ,methods: {

    /**
     * Call print on the iframe if the page is ready
     */
    onClickPrint(){
      const {contentWindow} = this.getIFrameContent()
      contentWindow.print()
    }
  
    ,populateIframe(){
      return new Promise(resolve=>{
        setTimeout(()=>{
          const {contentDocument} = this.getIFrameContent()
          const contentBody = contentDocument.body
          //
          contentDocument.title = this.invoiceName
          //
          const html = this.$el.querySelector('.invoice').outerHTML.replace(/print\-invoice/,'')
          const styles = Array.from(document.querySelectorAll('style')).map(style=>style.outerHTML).join('')
          //
          contentBody.innerHTML = styles + html
          //
          resolve()
          this.pageReady = true
        })
      })
    }

    /**
     * For some reason these properties cannot be cached
     * @returns {{contentWindow: Window, contentDocument: Document}}
     */
    ,getIFrameContent(){
      const {contentWindow, contentDocument} = this.$el.querySelector('iframe')
      return {contentWindow, contentDocument}
    }

    /**
     * Create and download an image from the iframe if the page is ready
     */
    ,renderImage(){
      const {contentDocument} = this.getIFrameContent()
      /*contentDocument&&html2canvas(contentDocument.body, {
        // width: .2*210,
        // height: .2*297,
        // logging: true
      })
          .then(canvas=>{
            this.canvas = canvas
            this.dataUrl = this.canvas.toDataURL()
          })*/
    }

    /**
     * Inject custom CSS into iframe when sass has compiled
     * @param {string} css
     */
    ,onCssCompiled(css) {
      const {contentDocument} = this.getIFrameContent()
      if (contentDocument) {
        contentDocument.getElementById('invoiceCSS').textContent = css
      }
      // re-render image after css compilation
      this.renderImage()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '/../variables';
  header {
    display: flex;
    width: 100%;
    padding-top: $headerHeight + $padding;
    padding-bottom: $padding;
    >* {
      flex: 1 1 auto;
      text-align: center;
      &:first-child, &:last-child { flex: 0 0 auto; }
    }
  }
</style>