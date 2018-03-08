<template>
  <div>
    <button v-on:click="clone(project)" class="float-right">clone</button>
    <h1><span class="hide-low">Project: </span>{{project.description}}</h1>
    <section>
      <dl>
        <dt data-appExplain="'project.client'">client</dt>
        <dd><router-link class="input" v-bind:to="client.uri||''">{{client.name}}</router-link></dd>
        <dt data-appExplain="'project.description'">description</dt>
        <dd><input v-model="project.description"/></dd>
        <dt data-appExplain="'project.invoiceNr'">invoice number</dt>
        <dd><div class="input mono">{{project.invoiceNr}}</div></dd>
        <dt data-appExplain="'project.hourlyRate'">hourly rate</dt>
        <dd class="hourly-rate">
          <currency :value="project.hourlyRateCalculated" />
          <div v-bind:input-unit="currencySymbol"><input v-model.number="project.hourlyRate" type="number"/></div>
        </dd>
        <dt data-appExplain="'project.discount'">discount</dt>
        <dd class="discount">
          <div input-unit="%"><input v-model="project.discount" type="number" /></div>
          <currency :value="project.hourlyRate - project.hourlyRate*project.discount*0.01" class="text-align-left" />
        </dd>
        <dt data-appExplain="'project.paid'">paid</dt>
        <dd><label class="checkbox"><input v-model="project.paid" type="checkbox"/><span></span></label></dd>
      </dl>
    </section>
    
    <section>
      <button v-on:click="onAddLine()" class="float-right">add line</button>
      <h3>lines</h3>
      <table>
        <thead>
        <tr>
          <th width="60%">description</th>
          <th width="5%" class="hide-low">hours</th>
          <th class="hide-low"></th>
          <th>amount</th>
          <th>VAT</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(line, index) in project.lines" :key="index">
          <td><input v-model="line.description"/></td>
          <td class="hide-low"><input v-model.number="line.hours" type="number"/></td>
          <td class="hide-low"><currency @click.native="onClickLineCalculation(project,line)" :value="line.hours*project.hourlyRateDiscounted"/></td>
          <td><input v-model.number="line.amount" type="number" step="0.01"/></td>
          <td>
            <select v-model="line.vat" class="mono">
              <option v-for="vat in vatAmounts" v-bind:key="vat" v-bind:value="vat">{{vat}}</option>
            </select>
          </td>
          <td><button v-on:click="onRemoveLine(line)">&#10006;</button></td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td>total ex VAT</td>
          <td class="hide-low"><div class="input mono">{{project.totalHours}}</div></td>
          <td class="hide-low"><currency :value="project.totalHours*project.hourlyRateDiscounted"/></td>
          <td><currency class="float-right" :value="project.total"/></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>total inc VAT</td>
          <td class="hide-low"></td>
          <td class="hide-low"></td>
          <td><currency class="float-right" :value="project.totalIncDiscounted"/></td>
          <td></td>
          <td></td>
        </tr>
        </tfoot>
      </table>
    </section>
    
    <section>
      <header class="clearfix">
        <button v-on:click="onAddInvoice()" class="float-right" v-html="`add ${project.invoices&&project.invoices.length?'reminder':'invoice'}`">add invoice</button>
        <h3>invoices</h3>
      </header>
      <ul class="list-unstyled">
        <li v-for="(invoice, i) in project.invoices" v-bind:key="i" class="row no-gutters">
          <div class="col hide-low"></div>
          <div class="col invoice-link">
            <router-link v-bind:to="`${project.uri}/${invoice.type}${i!==0?'/'+i:''}`" class="btn">{{invoice.type}}{{i!==0?'&nbsp;' + i:''}}</router-link>
          </div>
          <div class="col"><input v-model="invoice.date" type="date" /></div>
          <div class="col text-align-right">
            <label v-if="i>0" class="checkbox"><input v-model="invoice.interest" type="checkbox"/><span title="add interest"></span></label>
            <label v-if="i>1" class="checkbox"><input v-model="invoice.exhortation" type="checkbox"/><span title="exhortation"></span></label>
          </div>
          <div class="col text-align-right">
            <button v-on:click="onRemoveInvoice(invoice)">&#10006;</button>
          </div>
        </li>
      </ul>
    </section>
    
    <section>
      <a v-bind:href="`${project.uri}/quotation`" class="btn float-right">show quotation</a>
      <h3>quotation</h3>
      <dl>
        <template v-for="qt in quotation">
          <dt v-explain="'project.'+qt.property"></dt>
          <!--<strong>{{qt.property}}</strong>-->
          <dd v-if="qt.type==='textarea'"><textarea v-model="project[qt.property]" /></dd>
          <dd v-else><input v-model="project[qt.property]" v-bind:type="qt.type" /></dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency'
import signals from '@/signals'
import {create as createInvoice} from '@/model/invoice'
import {track,untrack,save} from '@/formState'
import moment from 'moment'

export default {
  name: 'project'
  ,data () {
    return {
      client:{}
      ,project:{}
      ,vatAmounts: model.personal.vatAmounts.split(/,/g).map(parseFloat)
      ,quotation: [
        { property: 'quotationAfter', type: 'textarea' }
        ,{ property: 'quotationBefore', type: 'textarea' }
        ,{ property: 'quotationDate', type: 'date' }
        ,{ property: 'quotationDuration', type: 'text' }
        ,{ property: 'quotationStartDate', type: 'date' }
        ,{ property: 'quotationSubject', type: 'text' }
      ]
      ,currencySymbol: model.config.currencySymbol
    }
  }
  ,components: {
    Currency
  }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    //
//    this.project = track(this.$el,this.client.projects[parseInt(this.$route.params.projectIndex,10)],this.deleteProject)
    this.project = track(this.$el,this.client.getProject(parseInt(this.$route.params.projectIndex,10)),this.deleteProject)
//    console.log('project',project,project.prototype); // todo: remove log
  }
  ,destroyed: untrack
  ,methods: {
    onRemoveLine(line) {
      const lines = this.project.lines,
          i = lines.indexOf(line)
      i!==-1&&lines.splice(i, 1)
    }
    ,onAddLine(){
      this.project.addLine()
    }
    ,onClickLineCalculation(project, line) {
      line.amount = line.hours*project.hourlyRateDiscounted
    }
    ,clone(project) {
      const clone = project.cloneNew();
      clone.client.projects.push(clone)
      this.$router.push(clone.uri)
      this.project = track(this.$el,clone,this.deleteProject)
      save()
    }
    ,deleteProject() {
      const project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
      confirm('Delete this project?') && this.client.deleteProject(project) && (save(),this.$router.push(this.client.uri))
    }
    ,onAddInvoice(){
      this.project.addInvoice()
      save()
    }
    ,onRemoveInvoice(invoice){
      if (confirm('Remove this invoice?')) {
        const {project} = this
        const {invoices} = project
        const index = invoices.indexOf(invoice)
        index!==-1&&invoices.splice(index,1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .invoice-link {
    flex: 0 0 110px;
  }
  .hourly-rate, .discount {
    display: flex;
    *:first-child {
      flex: 0 0 75px;
      margin-right: 10px;
    }
    *:last-child {
      flex: 1 1 auto;
    }
  }
</style>
