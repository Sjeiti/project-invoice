<template>
  <div class="page-quarter">
    <header>
      <nav>
        <ul class="list-unstyled list-inline">
          <li v-for="y in years" v-bind:class="{current:y===year}"><router-link v-bind:to="`/overview/quarter/${y}`">{{y}}</router-link></li>
        </ul>
      </nav>
    </header>
    <section v-for="(quarter, i) in quarters" :key="i">
      <h3 class="float-left">quarter {{i+1}}</h3>
      <button data-ngClick="onClickCsv(quarter)" class="btn btn-secondary btn-sm float-right">copy csv data</button>
      
      <project-list :projects="quarter" :cols="'invoiceNr date clientName description totalDiscounted totalVatDiscounted totalIncDiscounted'"></project-list>
      
      <!--<table>
        <thead><tr>
          <th width="10%" data-order-key="invoiceNr">nr</th>
          <th width="10%" data-order-key="date">date</th>
          <th width="20%" data-order-key="client">client</th>
          <th width="33%" data-order-key="description">description</th>
          <th width="9%" data-order-key="totalDiscounted" class="text-right">ex</th>
          <th width="9%" data-order-key="totalVatDiscounted" class="text-right">VAT</th>
          <th width="9%" data-order-key="totalIncDiscounted" class="text-right">total</th>
        </tr></thead><tbody>
          <tr v-for="project in quarter" class="row-select">
            <td><router-link v-bind:to="project.uri">{{project.invoiceNr}}</router-link></td>
            <td><small>{{project.date}}</small></td>
            <td class="text-overflow">{{project.client.name}}</td>
            <td class="text-overflow">{{project.description}}</td>
            <td class="text-right"><currency :value="project.totalDiscounted"></currency></td>
            <td class="text-right"><currency :value="project.totalVatDiscounted"></currency></td>
            <td class="text-right"><currency :value="project.totalIncDiscounted"></currency></td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="row-select">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right"><currency :value="getTotalDiscounted(quarter)"></currency></td>
            <td class="text-right"><currency :value="getTotalVatDiscounted(quarter)"></currency></td>
            <td class="text-right"><currency :value="getTotalIncDiscounted(quarter)"></currency></td>
          </tr>
        </tfoot>
      </table>-->
    </section>
    <!--<section>
      <table>
        <thead><tr>
          <th width="10%"></th>
          <th width="10%"></th>
          <th width="35%"></th>
          <th width="40%"></th>
          <th data-order-key="totalDiscounted" class="text-right" width="10%">ex</th>
          <th data-order-key="totalVatDiscounted" class="text-right" width="10%">VAT</th>
          <th data-order-key="totalIncDiscounted" class="text-right" width="10%">total</th>
        </tr></thead><tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-right"><app-currency [amount]="getTotalDiscounted()"></app-currency></td>
            <td class="text-right"><app-currency [amount]="getTotalVatDiscounted()"></app-currency></td>
            <td class="text-right"><app-currency [amount]="getTotalIncDiscounted()"></app-currency></td>
          </tr>
        </tbody>
      </table>
    </section>-->
    <textarea class="visually-hidden"></textarea>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency'
import ProjectList from '@/components/ProjectList'
export default {
  name: 'quarter'
  ,data () {
    return {
      projects: []
      ,year: new Date().getFullYear()
      ,years: []
      ,quarters: [[], [], [], []]
      ,csvTemplate: ''
      ,elmCsv: document.createElement('div')
    }
  }
  ,components: {
    Currency
    ,ProjectList
  }
  ,mounted(){
    this.csvTemplate = model.config.csvTemplate
    this.projects = model.projects
    
    this.year = parseInt(this.$route.params.year,10)||this.year
    this.years = this.projects
        .filter(project=>project.invoices.length)
        .map(project=>project.year)
        .filter((elem, pos, arr) => arr.indexOf(elem)===pos)
        .sort()
    
    this.setQuarters()
  }
  ,watch: {
    '$route'() {
      this.year = parseInt(this.$route.params.year,10)||this.year
      this.setQuarters()
    }
  }
  ,methods: {
    
    setQuarters(){
      this.quarters.forEach(quarter=>quarter.length = 0)
      this.projects
          .filter(project=>project.invoices.length&&project.year===this.year)
          .forEach(project=>{
            const monthNumber = project.date.getMonth()
            const quarter = Math.ceil((monthNumber+1)/3)
            this.quarters[quarter-1].push(project)
          })
    }
  
    ,onClickCsv(quarter) {
      const parsed = quarter.map(project=>{
        const client = project.client,
          invoice = project.invoices.slice(0).shift(),
          currencyPipe = new CurrencyFormat(),
          data = this.modelService.getData().personal,
          currency = (...args) => currencyPipe.transform.apply(currencyPipe, args)
        return this.interpolationService.parse(this.csvTemplate, {
          project,
          client,
          invoice,
          data,
          currency
        })
      })
      this.elmCsv.value = parsed.join('\n')
      if (this.elmCsv && this.elmCsv.select) {
        this.elmCsv.select()
        try {
          document.execCommand('copy')
          this.elmCsv.blur()
        } catch (err) {
          alert('please press Ctrl/Cmd+C to copy')
        }
      }
    }
  
    ,getTotalDiscounted(quarter) {
      let total = 0
      if (quarter===undefined) {
        quarter = this.projects&&this.projects
          .filter(project=>project.invoices.length&&project.year===this.year)
      }
      quarter
          .forEach((project)=>{
            total += project.totalDiscounted
          })
      return total
    }
  
    ,getTotalVatDiscounted(quarter) {
      let total = 0
      if (quarter===undefined) {
        quarter = this.projects&&this.projects
          .filter(project=>project.invoices.length&&project.year===this.year)
      }
      quarter
          .forEach((project)=>{
            total += project.totalVatDiscounted
          })
      return total
    }
  
    ,getTotalIncDiscounted(quarter) {
      let total = 0
      if (quarter===undefined) {
        quarter = this.projects&&this.projects
          .filter(project=>project.invoices.length&&project.year===this.year)
      }
      quarter
          .forEach((project)=>{
            total += project.totalIncDiscounted
          })
      return total
    }
    
    
  }
}
</script>

<style type="scss">
  .current { font-weight: bold; }
  .page-quarter.page-quarter .alert-paid, .page-quarter.page-quarter .alert-paid * { color: inherit; }
  /*.page-quarter.page-quarter.page-quarter .alert {
    &-paid { &, * { color: inherit; }}
    &-late { &, * { color: inherit; }}
    &-pending { &, * { color: inherit; }}
    &-select { &, * { background-color: inherit; }}
  }*/
</style>