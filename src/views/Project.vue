<template>
  <div>
    <button v-on:click="clone(project)" class="float-right">clone</button>
    <h1>Project: {{project.description}}</h1>
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
          <currency :value="project.hourlyRateCalculated" class="text-align-left"/>
          <input v-model.number="project.hourlyRate" type="number"/>
        </dd>
        <dt data-appExplain="'project.discount'">discount</dt>
        <dd><input v-model="project.discount" type="number"/></dd>
        <dt data-appExplain="'project.discountRate'">discounted rate</dt>
        <dd><currency :value="project.hourlyRate - project.hourlyRate*project.discount*0.01" class="text-align-left"/></dd>
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
          <th width="5%"><span class="hidden-xs-down">hours</span></th>
          <th></th>
          <th>amount</th>
          <th>VAT</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(line, index) in project.lines" :key="index">
          <td><input v-model="line.description"/></td>
          <td><input v-model.number="line.hours" type="number"/></td>
          <td><currency @click.native="onClickLineCalculation(project,line)" :value="line.hours*project.hourlyRateDiscounted"/></td>
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
          <td>
            <div class="input mono">{{project.totalHours}}</div>
          </td>
          <td><currency :value="project.totalHours*project.hourlyRateDiscounted"/></td>
          <td><currency class="float-right" :value="project.total"/></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>total inc VAT</td>
          <td></td>
          <td></td>
          <td><currency class="float-right" :value="project.totalIncDiscounted"/></td>
          <td></td>
          <td></td>
        </tr>
        </tfoot>
      </table>
    </section>
    
    <section>
      <header class="clearfix">
        <button v-on:click="onAddInvoice()" class="float-right">add invoice</button>
        <h3>invoices</h3>
      </header>
      <ul class="list-unstyled">
        <li v-for="(invoice, i) in project.invoices" v-bind:key="i" class="row">
          <div class="col-3"></div>
          <div class="col-3 col-md-2">
            <router-link v-bind:to="`${project.uri}/${invoice.type}${i!==0?'/'+i:''}`" class="btn">{{invoice.type}}{{i!==0?'&nbsp;' + i:''}}</router-link>
          </div>
          <div class="col-2 col-md-3"><input v-model="invoice.date" type="date"/></div>
          <div class="col-2 col-md-2 text-align-right">
            <label v-if="i>0" class="checkbox"><input v-model="invoice.interest" type="checkbox"/><span title="add interest"></span></label>
            <label v-if="i>1" class="checkbox"><input v-model="invoice.exhortation" type="checkbox"/><span title="exhortation"></span></label>
          </div>
          <div class="col-2 col-md-5 text-align-right">
            <button v-on:click="onRemoveInvoice(invoice)">&#10006;</button>
          </div>
        </li>
      </ul>
    </section>
    
    <section>
      <a v-bind:href="`${project.uri}/quotation`" class="btn float-right">show quotation</a>
      <h3>quotation</h3>
      <dl>
        <dt data-appExplain="'project.quotationBefore'">quotation before</dt>
        <dd><textarea v-model="project.quotationBefore"></textarea></dd>
        <dt data-appExplain="'project.quotationAfter'">quotation after</dt>
        <dd><textarea v-model="project.quotationAfter"></textarea></dd>
        <dt data-appExplain="'project.quotationDate'">quotation date</dt>
        <dd><input v-model="project.quotationDate" type="date"/></dd>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency.vue'
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
    }
  }
  ,components: {
    Currency
  }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    //
    const project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
    const projectClone = project.clone()
    this.project = projectClone
    track(this.$el,project,projectClone,this.deleteProject)
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
      console.log('clonedProject',JSON.parse(JSON.stringify(project))); // todo: remove log
      //const clonedProject = this.modelService.cloneProject(project)
      //this.router.navigate([clonedProject.uri])
    }
    ,deleteProject() {
      const project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
      confirm('Delete this project?') && this.client.deleteProject(project) && (save(),this.$router.push(this.client.uri))
    }
    ,onAddInvoice(){
      const {project} = this
      const {invoices} = project
      invoices.push(createInvoice({
        date: moment().format('YYYY-MM-DD'),
        type: invoices.length===0?'invoice':'reminder', // todo: from const
        interest: false,
        exhortation: false
      }))
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

