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
      <textarea class="visually-hidden"></textarea>
    </section>
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