<template>
  <div>
    <button v-on:click="clone(project)" class="float-right button--lower">clone</button>
    <h1><span class="hide-low">Project: </span>{{project.description}}</h1>
    <section>
      <dl>
        <dt data-appExplain="'project.client'">client</dt>
        <dd><router-link class="input" v-bind:to="client.uri||''">{{client.name}}</router-link></dd>
        <dt data-appExplain="'project.description'">description</dt>
        <dd><input v-model="project.description" ref="description" /></dd>
        <dt data-appExplain="'project.invoiceNr'">invoice number</dt>
        <dd><div class="input mono">{{project.invoiceNr}}</div></dd>
        <dt data-appExplain="'project.hourlyRate'">hourly rate</dt>
        <dd class="hourly-rate">
          <currency :value="project.hourlyRateCalculated" />
          <div v-bind:input-unit="currencySymbol"><input v-model.number="project.hourlyRate" type="number"/></div>
        </dd>
        <dt data-appExplain="'project.discount'">discount</dt>
        <dd class="discount">
          <div input-unit="%"><input v-model.number="project.discount" type="number" /></div>
          <currency :value="project.hourlyRate - project.hourlyRate*project.discount*0.01" class="text-align-left" />
        </dd>
        <dt data-appExplain="'project.paid'">paid</dt>
        <dd><label class="checkbox"><input v-model="project.paid" type="checkbox"/><span></span></label></dd>
        <dt data-appExplain="'project.ignore'">ignore</dt>
        <dd><label class="checkbox"><input v-model="project.ignore" type="checkbox"/><span></span></label></dd>
      </dl>
    </section>
    
    <section>
      <header>
        <button v-on:click="onAddLine()" class="float-right">add line</button>
        <h3>lines</h3>
      </header>
      <table>
        <thead>
        <tr>
          <th></th>
          <th width="60%">description</th>
          <th width="5%" class="hide-low">hours</th>
          <th class="hide-low text-align-center" v-on:click="onClickLineCalculations(project)">⇥</th>
          <th>amount</th>
          <th>VAT</th>
          <th></th>
        </tr>
        </thead>
        <tbody is="draggable" v-model="project.lines" :element="'tbody'" :options="{handle:'.icon-drag'}">
          <tr v-for="(line, index) in project.lines" :key="index">
            <td><i class="icon-drag" v-if="project.lines.length>1"></i></td>
            <td><input v-model="line.description" ref="lineDescription" /></td>
            <td class="hide-low"><input v-model.number="line.hours" type="number"/></td>
            <td class="hide-low"><currency @click.native="onClickLineCalculation(project,line)" :value="line.hours*project.hourlyRate"/></td>
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
            <td></td>
            <td>total ex VAT</td>
            <td class="hide-low"><div class="input mono">{{project.totalHours}}</div></td>
            <td class="hide-low"><currency :value="project.totalHours*project.hourlyRate"/></td>
            <td><currency class="float-right" :value="project.total"/></td>
            <td></td>
            <td></td>
          </tr>
          <tr v-if="project.discount">
            <td></td>
            <td>discount {{project.discount}}%</td>
            <td class="hide-low"></td>
            <td class="hide-low"><currency :value="project.totalHours*project.hourlyRateDiscounted"/></td>
            <td><currency class="float-right" :value="project.totalDiscounted"/></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
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
      <header>
        <button v-on:click="onAddInvoice()" class="float-right" v-html="`add ${project.invoices&&project.invoices.length?'reminder':'invoice'}`">add invoice</button>
        <h3>invoices</h3>
      </header>
      <ol class="list-unstyled">
        <li v-for="(invoice, i) in project.invoices" v-bind:key="i" class="row no-gutters">
          <div class="col hide-low"></div>
          <div class="col invoice-link">
            <router-link v-bind:to="`${project.uri}/${invoice.type}${i!==0?'/'+i:''}`" class="btn">{{invoice.type}}{{i!==0?'&nbsp;' + i:''}}</router-link>
          </div>
          <div class="col"><input v-model="invoice.date" type="date" /></div>
          <div class="col text-align-right position-relative">
            <label v-if="i>0" class="checkbox interest"><input v-on:click="onClickInvoiceCheck($event,invoice.interest,true)" v-model="invoice.interest" type="checkbox"/><span title="add interest"></span></label>
            <label v-if="i>1" class="checkbox exhortation"><input v-on:click="onClickInvoiceCheck($event,invoice.exhortation,false)" v-model="invoice.exhortation" type="checkbox"/><span title="exhortation"></span></label>
          </div>
          <div class="col text-align-right">
            <button v-on:click="onRemoveInvoice(invoice)">&#10006;</button>
          </div>
        </li>
      </ol>
    </section>
    
    <section>
      <header>
        <router-link v-bind:to="`${project.uri}/quotation`" class="btn float-right">show quotation</router-link>
        <h3>quotation</h3>
      </header>
      <dl>
        <template v-for="qt in quotation">
          <dt v-explain="'project.'+qt.property"></dt>
          <dd v-if="qt.type==='textarea'">
            <InterpolationUI v-model="project[qt.property]"></InterpolationUI>
          </dd>
          <dd v-else><input v-model="project[qt.property]" v-bind:type="qt.type" /></dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import Currency from '../components/Currency'
import {notify} from '../components/Notification'
import {track,untrack,save} from '../formState'
import InterpolationUI from '../components/InterpolationUI'
import draggable from 'vuedraggable'
import device from 'current-device'
import {confirm} from '../components/Modal'

export default {
  name: 'project'
  ,extends: BaseView
  ,data(){
    return {
      client:{}
      ,project:{}
      ,vatAmounts: model.personal.vatAmounts.split(/,/g).map(parseFloat)
      ,quotation: [
        { property: 'quotationDate',type: 'date' }
        ,{ property: 'quotationDuration',type: 'text' }
        ,{ property: 'quotationStartDate',type: 'date' }
        ,{ property: 'quotationSubject',type: 'text' }
        ,{ property: 'quotationBefore',type: 'textarea' }
        ,{ property: 'quotationAfter',type: 'textarea' }
      ]
      ,currencySymbol: model.config.currencySymbol
    }
  }
  ,components: { Currency,InterpolationUI,draggable }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    this.project = track(this.$el,this.client.getProject(parseInt(this.$route.params.projectIndex,10)),this.deleteProject)
    const { lines } = this.project
    lines&&(lines.length===0||!lines[0].description)&&this.$refs.description.focus()
  }
  ,destroyed: untrack
  ,methods: {
    /**
     * Remove a project line
     * @param {projectLine} line
     */
    onRemoveLine(line){
      const lines = this.project.lines
          ,i = lines.indexOf(line)
      i!==-1&&lines.splice(i,1)
    }
    /**
     * Add a new line to the project
     */
    ,onAddLine(){
      this.project.addLine()
      setTimeout(()=>{
        const descriptions = this.$refs.lineDescription
        const num = descriptions.length
        num&&descriptions[num-1].focus()
      })
    }
    /**
     * When set estimates to the cost fields
     * @param {project} project
     */
    ,onClickLineCalculations(project){
      project.lines.forEach(line=>this.onClickLineCalculation(project,line))
    }
    /**
     * When clicking the estimate set the same value to the cost field
     * @param {project} project
     * @param {projectLine} line
     */
    ,onClickLineCalculation(project,line){
      line.amount = line.hours*project.hourlyRate
    }
    /**
     * Clone the project to a new project
     * @param {project} project
     */
    ,clone(project){
      const clone = project.cloneNew()
      clone.client.projects.push(clone)
      this.$router.push(clone.uri)
      this.project = track(this.$el,clone,this.deleteProject)
      save()
      notify(`Project '${project.description}' cloned`)
      this.$refs.description.focus()
    }
    /**
     * Delete the project by confirm
     */
    ,deleteProject(){
      const project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
      confirm('Delete this project?')
          .then(()=>{
            this.client.deleteProject(project)
            save()
            this.$router.push(this.client.uri)
            notify(`Project '${project.description}' has been deleted`)
          },()=>{})
    }
    /**
     * Add an invoice and save the project
     */
    ,onAddInvoice(){
      this.project.addInvoice()
      save()
    }
    /**
     * Remove an invoice
     * @param {invoice} invoice
     */
    ,onRemoveInvoice(invoice){
      const {project} = this
      const {invoices} = project
      const index = invoices.indexOf(invoice)
      index!==-1&&invoices.splice(index,1)
    }
    /**
     * Click the invoice interest or exhortation checkbox
     * @param {Event} e
     * @param {boolean} isChecked
     * @param {boolean} interest
     */
    ,onClickInvoiceCheck(e,isChecked,interest){
      !isChecked&&device.mobile()&&!window.confirm(interest?'Add interest?':'Is this reminder the final exhortation?')&&e.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  @import '../style/icons';
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
  tbody tr:first-child td {
    padding-top: 4px;
  }
  label.checkbox.interest span:before { content: $icon-promile; }
  label.checkbox.exhortation span:before { content: $icon-stop; }
</style>
