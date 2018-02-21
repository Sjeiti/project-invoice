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
      <header>
        <h3>quarter {{i + 1}}</h3>
        <button v-on:click="onClickCsv(quarter)">copy csv data</button>
      </header>
      <project-list :projects="quarter" :cols="'invoiceNr date clientName description totalDiscounted totalVatDiscounted totalIncDiscounted'"></project-list>
    </section>
    <textarea class="visually-hidden" ref="csv"></textarea>
  </div>
</template>

<script>
import model from '@/model'
import Currency from '@/components/Currency'
import ProjectList from '@/components/ProjectList'
import {currency} from '@/util'
import {parse} from '@/util/interpolationService'
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
    this.elmCsv = this.$refs.csv
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
        const client = project.client
          ,invoice = project.invoices.slice(0).shift()
        return parse(this.csvTemplate, {
          project
          ,client
          ,invoice
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

<style lang="scss" scoped>
  nav a {
    text-decoration: none;
    padding-right: 10px;
  }
  header {
    position: relative;
    button {
      position: absolute;
      right: 0;
      top: 20px;
    }
  }
  .current {
    font-weight: bold;
    cursor: default;
  }
  .page-quarter.page-quarter .alert-paid, .page-quarter.page-quarter .alert-paid * { color: inherit; }
  /*.page-quarter.page-quarter.page-quarter .alert {
    &-paid { &, * { color: inherit; }}
    &-late { &, * { color: inherit; }}
    &-pending { &, * { color: inherit; }}
    &-select { &, * { background-color: inherit; }}
  }*/
</style>
