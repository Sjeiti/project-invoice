<template>
  <table>
    <thead><tr>
      <th v-for="col in columns" v-on:click="onClickOrder(col)">{{colName[col]}}</th>
    </tr></thead>
    <tbody><tr
        v-for="project in projects"
        class="row-select"
        v-bind:class="{'row-select':true,'alert-paid':project.paid,'alert-late':project.isLate,'alert-pending':project.isPending}"
        v-on:click="onRowClick(project)"
    >
      <td v-for="col in columns">
        
        <template v-if="col==='paid'">
          
          <label v-on:click.stop class="checkbox"><input v-model="project.paid" data-change="onPaidChange()" type="checkbox" /><span></span></label>
          
        </template>
        <template v-else-if="col==='invoiceNr'">
          <router-link class="small" :to="project.uri">{{project.invoiceNr}}</router-link>
        </template>
        <template v-else-if="col==='date'||col==='dateLatest'">
          <date class="small nowrap" :value="project[col]" />
        </template>
        <template v-else-if="col==='totalDiscounted'||col==='totalVatDiscounted'||col==='totalIncDiscounted'">
          <currency :value="project[col]" />
        </template>
        <template v-else-if="col==='actions'">
          <button class="btn-sm" v-if="project.invoices.length===0" v-on:click="onAddInvoice(project)">Add invoice</button>
          <button class="btn-sm" v-else-if="project.overdue" v-on:click="onAddReminder(project)">Add reminder</button>
        </template>
        <template v-else>
          {{project[col]}}
        </template>
        
      </td>
    </tr></tbody>
    <tfoot v-if="totals"><tr>
      <th v-for="col in columns">
        
        <template v-if="col==='totalDiscounted'||col==='totalVatDiscounted'||col==='totalIncDiscounted'">
          <currency :value="getTotalValue(col)" />
        </template>
        <template v-else>
          {{getTotalValue(col)}}
        </template>
        
      </th>
    </tr></tfoot>
  </table>
</template>

<script>
import Currency from '@/components/Currency'
import Date from '@/components/Date'
export default {
  name: 'ProjectList'
  ,props: {
    projects:{default:null}
    ,cols:{default:null}
    ,totals:{default:true}
  }
  ,data () {
    return {
      columns: ['paid','invoiceNr','date','dateLatest','clientName','description','totalIncDiscounted']
      ,sort: 'paid'
      ,asc: true
      ,colName: {
        paid: 'paid'
        ,invoiceNr: 'nr'
        ,date: 'date'
        ,dateLatest: 'changed'
        ,clientName: 'client'
        ,description: 'description'
        ,totalDiscounted: 'ex'
        ,totalVatDiscounted: 'VAT'
        ,totalIncDiscounted: 'total'
        ,actions: 'actions'
      }
    }
  }
  ,mounted(){
    if (this.cols) {
      this.columns = this.cols.split(/[\s,]/g)
    }
    if (this.totals===undefined) {
      this.totals = true
    }
  }
  ,components: {
    Currency
    ,Date
  }
  ,methods: {
    onClickOrder(key){
      if (this.sort===key) this.asc = !this.asc
      else this.sort = key
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
    ,getTotalValue(property){
      let returnValue = ''
      if (this.projects&&this.projects.length) {
        const propertyType = typeof this.projects[0][property]
        if (propertyType==='number') {
          returnValue = this.projects.map(p=>p[property]).reduce((amt,v)=>amt+v,0)
        } else if (propertyType==='boolean') {
          returnValue = this.projects.map(p=>p[property]).reduce((amt,v)=>amt+(v&&1||0),0)
        }
      }
      return returnValue
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  .alert {
    &-paid { &, * { color: #AAA; }}
    &-late { &, * { color: red; }}
    &-pending { &, * { color: green; }}
    &-select { &, * { background-color: darken($colorBackground,5%); }}
  }
  table {
    td, th {
      max-width: 20vw;
      /*max-width: 200px;*/
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    button {
      white-space: nowrap;
    }
  }
</style>