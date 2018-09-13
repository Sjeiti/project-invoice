<template>
  <div class="project-list" v-bind:class="{'project-list':true,'empty':projects.length===0}">
    <p v-if="projects.length===0&&empty"><em v-_>{{empty}}</em></p>
    <table class="hoverable" v-if="projects.length>0||!empty">
      <thead><tr>
        <th v-for="col in columns" v-on:click="onClickOrder(col)" v-bind:class="'th-'+col" v-_="colName[col]">{{colName[col]}}</th>
      </tr></thead>
      <!--<tbody>-->
      <transition-group v-bind:name="animate?'animate-row':'a'+Date.now()" tag="tbody">
      
        <tr
            v-for="project in projects"
            :key="project.id"
            v-bind:class="{'row-select':true,'animate-row':animate,'alert-paid':project.paid,'alert-late':project.isLate,'alert-pending':project.isPending}"
            v-on:click="onRowClick(project)"
        >
          <td v-for="col in columns" v-bind:class="'colname-'+col">

            <template v-if="col==='paid'">
              <label v-on:click.stop class="checkbox"><input v-model="project.paid" v-on:change="onPaidChange(project)" type="checkbox" /><span></span></label>
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
              <button v-on:click.stop v-if="project.invoices.length===0" v-on:click="onAddInvoice(project)"><span class="hide-low">Add invoice</span><span class="icon-file icon-add-round hide-high"></span></button>
              <button v-on:click.stop v-else-if="project.overdue" v-on:click="onAddReminder(project)"><span class="hide-low">Add reminder</span><span class="icon-file icon-add-round hide-high"></span></button>
            </template>
            <template v-else>
              <router-link :to="project.uri" v-ellipsis v-bind:data-text="project[col]">{{project[col]}}</router-link>
            </template>
            
          </td>
        </tr>
        <tr :key="'empty'" v-if="projects.length===0"><td>-</td></tr>
      
      </transition-group>
      <!--</tbody>-->
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
  </div>
</template>

<script>
import Currency from '../components/Currency'
import Date from '../components/Date'
import {save} from '../formState'
import {projectPaid} from '../util/signal'

export default {
  name: 'ProjectList'
  ,props: {
    projects:{default:null}
    ,cols:{default:null}
    ,sort:{default:'paid'}
    ,totals:{default:true}
    ,animate:{default:false}
    ,empty:{default:''}
  }
  ,data(){
    return {
      columns: ['paid','invoiceNr','date','dateLatest','clientName','description','totalIncDiscounted']
      ,sortValue: 'paid'
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
    if (this.cols){
      this.columns = this.cols.split(/[\s,]/g)
    }
    if (this.totals===undefined){
      this.totals = true
    }
    const hasExclame = this.sort.substr(0,1)==='!'
    this.sortValue = hasExclame && this.sort.substr(1) || this.sort
    this.asc = hasExclame // should be negated but will be on next order call
    setTimeout(this.onClickOrder.bind(this,this.sortValue))
  }
  ,components: {
    Currency
    ,Date
  }
  ,methods: {
    /**
     * Header click to order the list
     * @param {string} key
     */
    onClickOrder(key){
      if (this.sortValue===key) this.asc = !this.asc
      else this.sortValue = key
      const gt = this.asc?-1:1
      const lt = this.asc?1:-1
      this.projects.sort((a,b)=>a[key]>b[key]?gt:lt)
    }
    /**
     * Action click handler to add a reminder to a project
     * @param {project} project
     */
    ,onAddReminder(project){
      this.addInvoice(project)
    }
    /**
     * Action click handler to add an invoice to a project
     * @param {project} project
     */
    ,onAddInvoice(project){
      this.addInvoice(project)
    }
    /**
     * Navigate to project when clicking row
     */
    ,onRowClick(project){
      this.$router.push(project.uri)
    }
    /**
     * Save after paid-checkbox toggle
     * @param {project} project
     */
    ,onPaidChange(project){
      save()
      projectPaid.dispatch(project)
    }
    /**
     * Action click handler to add an invoice or reminder to a project
     * @param {project} project
     */
    ,addInvoice(project){
      project.addInvoice()
      save()
      this.$router.push(project.uri)
    }
    /**
     * Get the total value for a specific column or property
     * @param {string} property
     * @returns {string}
     */
    ,getTotalValue(property){
      let returnValue = ''
      if (this.projects&&this.projects.length){
        const propertyType = typeof this.projects[0][property]
        if (propertyType==='number'){
          returnValue = this.projects.map(p=>p[property]).reduce((amt,v)=>amt+v,0)
        } else if (propertyType==='boolean'){
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
  .project-list>p { color: #333; }
  .alert {
    &-paid { &, * { color: #AAA; }}
    &-late { &, * { color: $colorRed; }}
    &-pending { &, * { color: green; }}
    &-select { &, * { background-color: darken($colorBackground,5%); }}
  }
  .alert {
    &-paid, &-late, &-pending, &-select {
      button { &, * { color: white; } }
    }
  }
  .project-list {
    max-width: 100vw;
    overflow-x: auto;
    overflow-y: hidden;
    &.empty { color: #AAA; }
  }
  .animate-row {
    &-enter, &-leave-to {
      transition: transform 500ms linear 200ms, opacity 500ms linear 200ms;
      opacity: 0;
      transform: scaleY(0);
    }
  }
  table {
    td, th { max-width: 20vw; }
    th {
      &:last-child { text-align: right; }
      &.th- {
        &paid, &actions {
          @media #{$breakpointLow} {
            font-size: 0;
          }
        }
        &totalDiscounted, &totalVatDiscounted, &totalIncDiscounted { text-align: right; }
      }
    }
    label.checkbox span {
      transform: translateY(3px);
    }
    label.checkbox span, button {
      margin-bottom: 0;
      white-space: nowrap;
    }
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button { float: right; }
  .input.mono {
    float: right;
    padding-right: 0;
  }
  .middle-ellipsis {
    display: block;
  }
  .colname-invoiceNr,
  .colname-date {
    padding-right: 8px;
  }
  .colname-clientName,
  .colname-description {
    padding-right: 16px;
  }
</style>
