<template>
  <table>
    <thead><tr>
      <th v-if="col.paid" v-on:click="onClickOrder('paid')" width="5%">paid</th>
      <th v-if="col.nr" v-on:click="onClickOrder('invoiceNr')" width="10%">nr</th>
      <th v-if="col.date" v-on:click="onClickOrder('date')" width="10%">date</th>
      <th v-if="col.changed" v-on:click="onClickOrder('changed')" width="10%">changed</th>
      <th v-if="col.client" v-on:click="onClickOrder('client')" width="35%">client</th>
      <th v-if="col.description" v-on:click="onClickOrder('description')" width="40%">description</th>
      <th v-if="col.amount" v-on:click="onClickOrder('totalIncDiscounted')" width="10%">amount</th>
      <th v-if="col.actions">actions</th>
    </tr></thead>
    <tbody>
      <tr v-for="project in projects"
          class="row-select"
          v-bind:class="{'row-select':true,'alert-paid':project.paid,'alert-late':project.isLate,'alert-pending':project.isPending}"
          v-on:click="onRowClick(project)"
      >
        <td v-if="col.paid"><label v-on:click.stop class="checkbox"><input v-model="project.paid" data-change="onPaidChange()" type="checkbox" /><span></span></label></td>
        <td v-if="col.nr"><router-link class="small" :to="project.uri">{{project.invoiceNr}}</router-link></td>
        <td v-if="col.date"><date class="small nowrap" :value="project.date" /></td>
        <td v-if="col.changed"><date class="small nowrap" :value="project.dateLatest" /></td>
        <td v-if="col.client" class="ellipsis" :title="project.client.name"><span>{{project.client.name}}</span></td>
        <td v-if="col.description" class="ellipsis" :title="project.description"><span>{{project.description}}</span></td>
        <td v-if="col.amount" class="text-right"><currency :value="project.totalIncDiscounted" /></td>
        <td v-if="col.actions">
          <button v-if="project.overdue" v-on:click="onAddReminder(project)">Add reminder</button>
          <button v-if="project.invoices.length===0" v-on:click="onAddInvoice(project)">Add invoice</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Currency from '@/components/Currency'
import Date from '@/components/Date'
export default {
  name: 'ProjectList'
  ,props: ['projects','cols']
  ,data () {
    return {
      col: {paid:true, nr:true, date:true, changed:true, client:true, description:true, amount:true, actions:false}
      ,sort: 'paid'
      ,asc: true
    }
  }
  ,mounted(){
    if (this.cols) for (let key in this.col) this.col[key] = this.cols.includes(key)
  }
  ,components: {
    Currency
    ,Date
  }
  ,methods: {
    onClickOrder(key){
      if (this.sort===key) this.asc = !this.asc
      else this.sort = key
      console.log('onClickOrder',this.sort,this.asc); // todo: remove log
      const gt = this.asc?-1:1
      const lt = this.asc?1:-1
      this.projects.sort((a,b)=>a[key]>b[key]?gt:lt)
    }
    ,onAddReminder(project){
      console.log('onAddReminder',project); // todo: remove log
    }
    ,onAddInvoice(project){
      console.log('onAddInvoice',project); // todo: remove log
    }
    ,onRowClick(project){
      this.$router.push(project.uri)
    }
  }
}
</script>

<style lang="scss" SCOSPED>
@import '/../variables';
.alert {
  &-paid { &, * { color: #AAA; }}
  &-late { &, * { color: red; }}
  &-pending { &, * { color: green; }}
  &-select { &, * { background-color: darken($colorBackground,5%); }}
}
table button {
  white-space: nowrap;
}
</style>