<template>
  <section>
    <header>
      <h1><span class="hide-low" v-__>Invoice </span><router-link v-bind:to="project.uri||''">{{project.invoiceNr}}</router-link></h1>
      <div class="invoice-options">
        <button v-on:click="onClickPrint()"
                v-bind:disabled="!pageReady" v-__>print</button>
      </div>
      <lang></lang>
    </header>
    <print-invoice ref="invoice" :client="client" :project="project" :invoice="invoice" />
  </section>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import Currency from '../components/Currency.vue'
import Lang from '../components/Lang.vue'
import PrintInvoice from '../components/PrintInvoice.vue'

export default {
  name: 'invoice'
  ,extends: BaseView
  ,data(){
    return {
      client:{}
      ,project:{}
      ,invoice:{}
      ,pageReady:true // should dispatch from print-invoice
    }
  }
  ,components: {
    Currency
    ,Lang
    ,PrintInvoice
  }
  ,mounted(){
    const reminderNr = parseInt(this.$route.params.reminderNr,10)
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    this.project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
    this.invoice = this.project.invoices[reminderNr||0]||{}
  }
  ,methods: {

    /**
     * Call print on the iframe if the page is ready
     */
    onClickPrint(){
      const iframe = this.$refs.invoice.$refs.iframe
      iframe.contentWindow.print()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
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
    .invoice-options {
      &, &+* {
        padding-top: 18px;
      }
    }
  }
</style>