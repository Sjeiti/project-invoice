<template>
  <div>
    <button v-on:click="clone(project)" class="float-right button--lower">clone</button>
    <h1><span class="hide-low">Project: </span>{{project.description}}</h1>
    <section>
      <dl>
        <dt data-appExplain="'project.client'">client</dt>
        <dd><router-link class="input" v-bind:to="client.uri||''">{{client.name}}</router-link></dd>
        <dt data-appExplain="'project.description'" >description</dt>
        <dd><input v-model="project.description" ref="description" /></dd>
      </dl>
      <div class="position-relative">
        <label for="projectProperties"><i class="icon-cog color-button"></i></label>
        <input id="projectProperties" type="checkbox" class="reveal visually-hidden" />
        <dl>
          <dt data-appExplain="'project.discount'">discount</dt>
          <dd class="discount">
            <div input-unit="%"><input v-model.number="project.discount" type="number" /></div>
            <currency :value="project.hourlyRate - project.hourlyRate*project.discount*0.01" class="text-align-left" />
          </dd>
          <dt data-appExplain="'project.hourlyRate'">hourly rate</dt>
          <dd class="hourly-rate">
            <currency :value="project.hourlyRateCalculated" />
            <div v-bind:input-unit="currencySymbol"><input v-model.number="project.hourlyRate" type="number"/></div>
          </dd>
          <dt data-appExplain="'project.paid'">paid</dt>
          <dd><label class="checkbox"><input v-model="project.paid" type="checkbox"/><span></span></label></dd>
          <dt data-appExplain="'project.ignore'">ignore</dt>
          <dd><label class="checkbox"><input v-model="project.ignore" type="checkbox"/><span></span></label></dd>
        </dl>
      </div>
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
            <td><button v-on:click="onRemoveLine(line)"><i class="icon-close"></i></button></td>
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
    
    <tabs v-model="tabs">
      <tab id="qut">quotation</tab>
      <tab>invoices</tab>
    </tabs>
    
    <p>{{tabs}}</p>
  
    <input class="tabs-trigger" type="checkbox" v-model="tabs[0]" />
    <section>
      <header>
        <button v-on:click="onAddInvoice()" class="float-right" v-html="`add ${project.invoices&&project.invoices.length?'reminder':'invoice'}`">add invoice</button>
        <h3>invoices</h3>
      </header>
      <ol class="list-unstyled invoices">
        <li v-for="(invoice, i) in project.invoices" v-bind:key="i" class="row no-gutters">
          <div class="col-4">
            <router-link
                v-bind:to="`${project.uri}/${invoice.type}${i!==0?'/'+i:''}`"
                v-bind:title="project.invoiceNr"
                class="btn">{{invoice.type}}{{i!==0?'&nbsp;' + i:''}}</router-link>
          </div>
          <div class="col input hide-low">{{project.invoiceNr}}</div>
          <div class="col-3 input">{{invoice.date}}</div>
          <div class="col input">
            <i v-if="invoice.interest" class="icon-promile" title="Legal interest was added"></i>
            <i v-if="invoice.exhortation" class="icon-stop" title="Final exhortation"></i>
            <i v-if="invoice.paid" class="icon-time" title="Some paid"></i>
          </div>
          <div class="col text-align-right">
            <button v-if="i===project.invoices.length-1" v-on:click="onRemoveInvoice(invoice)"><i class="icon-close"></i></button>
            <button v-on:click="onEditInvoice(invoice)"><i class="icon-pencil"></i></button>
          </div>
        </li>
      </ol>
    </section>
    
    <input class="tabs-trigger" type="checkbox" v-model="tabs[1]" />
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
import Tabs from '../components/Tabs'
import draggable from 'vuedraggable'
import device from 'current-device'
import {confirm,modal} from '../components/Modal'
import moment from 'moment'

const noop = ()=>{}

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
      ,tabs: []
    }
  }
  ,components: { Currency,InterpolationUI,Tabs,draggable }
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
      const invoices = this.project.invoices
      const lastInvoice = [...invoices].pop()
      const data = {
        invoice: {
          date: moment().format('YYYY-MM-DD')
          ,interest: lastInvoice&&lastInvoice.interest||false
          ,exhortation: lastInvoice&&lastInvoice.exhortation||false
        }
        ,index: invoices.length
      }
      modal('add invoice','InvoiceProperties',data,'cancel','add')
          .then(data=>this.project.addInvoice(data.invoice),noop)
          .then(()=>this.$el.dispatchEvent(new CustomEvent('change')))
    }
    /**
     * Edit an invoice
     * @param {invoice} invoice
     */
    ,onEditInvoice(invoice){
      const data = {
        invoice: invoice.clone()
        ,index: this.project.invoices.indexOf(invoice)
      }
      modal('edit invoice','InvoiceProperties',data,'cancel','edit')
          .then(data=>Object.assign(invoice,data.invoice),noop)
          .then(()=>this.$el.dispatchEvent(new CustomEvent('change')))
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
  
  dl:first-child {
    margin-bottom: 0;
  }
  
  .invoices {
    .btn { white-space: nowrap; }
    li:nth-child(odd) {
      box-shadow: 0 2rem 0 $colorBackground inset;
    }
  }
  
  div.display-flex { justify-content: space-between; }
  input.reveal:checked+* { max-height: 200px; }
  label[for=projectProperties] {
    position: absolute;
    right: 0;
    top: 0.4rem;
    z-index: 1;
  }
  
  div.display-flex dl { margin-bottom: 0; }
  
  
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
