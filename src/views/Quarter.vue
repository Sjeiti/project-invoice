<template>
  <div class="page-quarter">
    <header>
      <nav>
        <ul class="list-unstyled list-inline tabs">
          <li v-for="y in years" v-bind:class="{selected:y===year}"><router-link v-bind:to="`/overview/quarter/${y}`">{{y}}</router-link></li>
        </ul>
      </nav>
    </header>
    <section v-for="(quarter, i) in quarters" :key="i">
      <header>
        <button v-on:click="onClickCsv(quarter)" v-bind:disabled="quarter.length===0" class="float-right" v-_>copy csv data</button>
        <h3><span v-_>quarter</span> {{i + 1}}</h3>
      </header>
      <project-list
          :projects="quarter"
          :cols="'invoiceNr date clientName description totalDiscounted totalVatDiscounted totalIncDiscounted'"
          :empty="'No projects in this quarter'"
      ></project-list>
    </section>
    <section>
      
      <header><h3 v-_>totals</h3></header>
      <table class="totals">
        <thead><tr>
          <th></th>
          <th v-_>ex</th>
          <th v-_>VAT</th>
          <th v-_>total</th>
        </tr></thead>
        <tbody><tr>
          <td></td>
          <td><currency :value="totals('totalDiscounted')" /></td>
          <td><currency :value="totals('totalVatDiscounted')" /></td>
          <td><currency :value="totals('totalIncDiscounted')" /></td>
        </tr></tbody>
      </table>
      
    </section>
    <textarea class="visually-hidden" ref="csv"></textarea>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import Currency from '../components/Currency'
import ProjectList from '../components/ProjectList'
import {parse} from '../service/interpolationService'
export default {
  name: 'quarter'
  ,extends: BaseView
  ,data(){
    return {
      projects: []
      ,year: new Date().getFullYear()
      ,years: []
      ,allyear: []
      ,quarters: [[],[],[],[]]
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
        .filter((elem,pos,arr) => arr.indexOf(elem)===pos)
        .sort()

    this.setQuarters()
    this.elmCsv = this.$refs.csv
  }
  ,watch: {
    '$route'(){
      this.year = parseInt(this.$route.params.year,10)||this.year
      this.setQuarters()
      this.$forceUpdate()
    }
  }
  ,methods: {

    setQuarters(){
      this.quarters = this.quarters.map(()=>[]) // setting length to 0 doesn't work because Vue doesn't see any (deep) change
      this.allyear = this.projects
          .filter(project=>project.invoices.length&&project.year===this.year)
      this.allyear
          .forEach(project=>{
            const monthNumber = project.date.getMonth()
            const quarter = Math.ceil((monthNumber+1)/3)
            this.quarters[quarter-1].push(project)
          })
    }

    ,onClickCsv(quarter){
      const parsed = quarter.map(project=>{
        const client = project.client
          ,invoice = project.invoices.slice(0).shift()
        return parse(this.csvTemplate,{
          project
          ,client
          ,invoice
        },true)
      })
      this.elmCsv.value = parsed.join('\n')
      if (this.elmCsv && this.elmCsv.select){
        this.elmCsv.select()
        try {
          document.execCommand('copy')
          this.elmCsv.blur()
        } catch (err){
          alert('please press Ctrl/Cmd+C to copy')
        }
      }
    }

    ,totals(property){
      return this.allyear.map(p=>p[property]).reduce((acc,i)=>acc+i,0)
    }

  }
}
</script>

<style lang="scss" scoped>
  ul.tabs {
    margin-top: 0;
    li {
      padding: 0.25rem 0.5rem 0;
      &.selected {
        font-weight: bold;
        cursor: default;
      }
    }
    a { text-decoration: none; }
  }
  .page-quarter.page-quarter .alert-paid, .page-quarter.page-quarter .alert-paid * { color: inherit; }
  
  .totals {
    th, td { &:first-child { width: 55vw; } }
    thead th { text-align: right; }
    td { font-weight: bold; }
    .input.mono {
      float: right;
      padding-right: 0;
    }
  }
  
</style>
