<template>
  <div>
    <section>
      <h1>Invoice</h1>
    </section>
    <section class="invoice-options">
      <router-link v-bind:to="project.uri||''" class="btn">back</router-link>
      <button data-ngClick="onClickPrint()"
              data-ngDisabled="!pageReady">print</button>
      <a data-ngClick="onClickDownload($event)"
         class="btn"
         data-ngClass="{disabled:!pageReady}"
         data-href="{-{dataUrl}}"
         download="{-{invoiceName}}.png">download</a>
  
      <lang class="float-right"></lang>
    </section>
    <section>
      <div class="invoice-shade">
        <div></div>
      </div>
      <print-invoice :client="client" :project="project" :invoice="invoice" />
    </section>
    <iframe class="visually-hidden"></iframe>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency.vue'
import Lang from '@/components/Lang.vue'
import PrintInvoice from '@/components/PrintInvoice.vue'
import signals from '@/signals'
import {track,save} from '@/formState'

export default {
  name: 'invoice'
  ,data () {
    return {
      client:{}
      ,project:{}
      ,invoice:{}
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
  }
}
</script>
