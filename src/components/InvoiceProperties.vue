<template>
  <div>
    <dl>
      <dt v-_>date</dt><dd><input v-model="invoice.date" type="date" /></dd>
      <dt v-if="index>0" v-_>legal interest</dt><dd v-if="index>0"><label class="checkbox"><input v-model="invoice.interest" type="checkbox"/><span></span></label></dd>
      <dt v-if="index>1" v-_>exhortation</dt><dd v-if="index>1"><label class="checkbox"><input v-model="invoice.exhortation" type="checkbox"/><span></span></label></dd>
      <dt v-_>paid</dt><dd><input v-model="invoice.paid" type="number"/></dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'InvoiceProperties'
  ,props: ['data']
  ,data(){
    return {
      invoice: {}
      ,index: 0
    }
  }
  ,mounted(){
    this.invoice = this.data.invoice
    this.index = this.data.index
  }
}
</script>

<style lang="scss" scoped>
  dt { padding-top: 0.4rem; }
</style>
