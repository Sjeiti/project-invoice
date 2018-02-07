<template>
  <div>
    <button data-click="clone(project)" class="btn-default float-right">clone</button>
    <h1>Project: {{project.description}}</h1>
  <section>
    <dl class="row">
      <dt data-appExplain="'project.client'">client</dt><dd class="input"><router-link v-bind:to="`/client/${client.nr}`">{{client.name}}</router-link></dd>
      <dt data-appExplain="'project.description'">description</dt><dd><input v-model="project.description" data-ngModelChange="onNgModelChanged()" /></dd>
      <dt data-appExplain="'project.invoiceNr'">invoice number</dt><dd><input v-model="project.invoiceNr" readonly /></dd>
      <dt data-appExplain="'project.hourlyRate'">hourly rate</dt>
      <dd class="hourly-rate">
        <input v-model="project.hourlyRateCalculated" readonly />
        <input v-model="project.hourlyRate" data-ngModelChange="onNgModelChanged()" type="number" />
      </dd>
      <dt data-appExplain="'project.discount'">discount</dt><dd><input v-model="project.discount" data-ngModelChange="onNgModelChanged()" type="number" /></dd>
      <dt data-appExplain="'project.discountRate'">discounted rate</dt><dd class="input">{{project.hourlyRate - project.hourlyRate*project.discount*0.01}}</dd>
      <dt data-appExplain="'project.paid'">paid</dt><dd><label class="checkbox"><input v-model="project.paid" type="checkbox" data-ngModelChange="onNgModelChanged()" /><span></span></label></dd>
    </dl>
  </section>

  <section>
    <button data-ngClick="onAddLine()" class="btn-primary float-right">add line</button>
    <h3>lines</h3>
    <table>
      <thead><tr>
        <th width="60%">description</th>
        <th width="5%"><span class="hidden-xs-down">hours</span></th>
        <th></th>
        <th>amount</th>
        <th>VAT</th>
        <th></th>
      </tr></thead>
      <tbody>
        <tr v-for="(line, index) in project.lines" :key="index">
          <td><input v-model="line.description" data-ngModelChange="onNgModelChanged()" /></td>
          <td><input v-model="line.hours" data-ngModelChange="onNgModelChanged()" type="number" /></td>
          <td><small data-ngDoubleClick="onClickCalculation(project,line)"><div data-app-currency>{{line.hours*project.hourlyRateDiscounted}}</div></small></td>
          <td><input v-model="line.amount" data-ngModelChange="onNgModelChanged()" type="number" step="0.01" /></td>
          <td>
            <select v-model="line.vat" data-ngModelChange="onNgModelChanged()">
              <option v-for="vat in vatAmounts" v-bind:key="vat" v-bind:value="vat">{{vat}}</option>
            </select>
          </td>
          <td><button data-ngClick="onRemoveLine(line)" class="btn-default">&#10006;</button></td>
        </tr>
      </tbody>
      <tfoot><tr>
        <td><strong>total ex VAT</strong></td>
        <td>{{project.totalHours}}</td>
        <td><small><div data-app-currency>{{project.totalHours*project.hourlyRateDiscounted}}</div></small></td>
        <td><div data-app-currency>{{project.total}}</div></td>
        <td></td>
        <td></td>
      </tr><tr>
        <td><strong>total inc VAT</strong></td>
        <td></td>
        <td></td>
        <td><div data-app-currency>{{project.totalIncDiscounted}}</div></td>
        <td></td>
        <td></td>
      </tr></tfoot>
    </table>
  </section>

  <section>
    <header class="clearfix">
      <button data-ngClick="onAddInvoice()" class="btn-primary float-right">add invoice</button>
      <h3>invoices</h3>
    </header>
    <ul class="list-unstyled">
      <li v-for="(invoice, i) in project.invoices" v-bind:key="i" class="row">
        <div class="col-3 col-md-3"><input v-model="invoice.date" data-ngModelChange="onNgModelChanged()" type="date" /></div>
        <div class="col-3 col-md-2"><a v-bind:href="`${project.uri}/${invoice.type}${i!==0?'/'+i:''}`" class="btn btn-sm btn-primary">{{invoice.type}} {{i!==0?i:''}}</a></div>
        <div class="col-4 col-md-2 form-inline">
          <label v-if="i>0" class="checkbox"><input v-model="invoice.interest" type="checkbox" /><span title="add interest"></span></label>
          <label v-if="i>1" class="checkbox"><input v-model="invoice.exhortation" type="checkbox" /><span title="exhortation"></span></label>
        </div>
        <div class="col-2 col-md-5"><button data-ngClick="onRemoveInvoice(invoice)" class="btn-default">&#10006;</button></div>
      </li>
    </ul>
  </section>

  <section>
    <a v-bind:href="`${project.uri}/quotation`" class="btn btn-sm btn-primary float-right">show quotation</a>
    <h3>quotation</h3>
    <dl>
      <dt data-appExplain="'project.quotationBefore'">quotation before</dt><dd><textarea v-model="project.quotationBefore"></textarea></dd>
      <dt data-appExplain="'project.quotationAfter'">quotation after</dt><dd><textarea v-model="project.quotationAfter"></textarea></dd>
      <dt data-appExplain="'project.quotationDate'">quotation date</dt><dd><input v-model="project.quotationDate" data-ngModelChange="onNgModelChanged()" type="date" /></dd>
    </dl>
  </section>
  </div>
</template>

<script>
import model from '@/model'

export default {
  name: 'project'
  ,data () {
    return {
      client:{}
      ,project:{}
      ,vatAmounts: model.personal.vatAmounts.split(/,/g).map(parseFloat)
    }
  }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    this.project = this.client.projects[parseInt(this.$route.params.projectIndex,10)]
  }
}
</script>

