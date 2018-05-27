<template>
  <div>
    <section>
      <header>
        <button v-on:click="onAddClient()" class="float-right" v-_>add client</button>
        <h1 class="hide-low" v-_>Clients</h1>
      </header>
      <table class="hoverable">
        <thead>
        <tr>
          <td v-_ class="hide-low text-align-right">nr</td>
          <td v-_>name</td>
          <td v-_ class="text-align-center">invoices</td>
          <td v-_>recent</td>
          <td v-_ class="hide-low">last</td>
          <td v-_ class="hide-low text-align-center">paid</td>
        </tr>
        </thead>
        <tbody>
          <tr v-for="client in sortedClients" :key="client.nr" v-on:click="onRowClick(client,$event)">
            <td class="hide-low text-align-right">{{client.nr}}</td>
            <td><router-link v-bind:to="client.uri">{{client.name}}</router-link></td>
            <td class="text-align-center">{{client.projects.length}} </td>
            <td><date v-if="client.latestProject" class="small nowrap" :value="client.latestProject.dateLatest" /></td>
            <td class="hide-low"><router-link v-if="client.latestProject" class="small" :to="client.latestProject.uri">{{client.latestProject.invoiceNr}}</router-link></td>
            <td class="hide-low text-align-center"><i v-if="client.latestProject" v-bind:class="hasOpenInvoices(client)?'icon-close':'icon-mark'"></i></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '@/model'
import Date from '../components/Date'

export default {
  name: 'clients'
  ,extends: BaseView
  ,data(){
    return {
        clients: model.clients
    }
  }
  ,components: { Date }
  ,methods: {
    onAddClient(){
      const client = model.addClient()
      client && this.$router.push(client.uri)
    }
    ,onRowClick(client,e){
      e.target.nodeName!=='A'&&this.$router.push(client.uri)
    }
    ,hasOpenInvoices(client){
      return client.projects.filter(project=>project.isLate).length>0
    }
  }
  ,computed: {
    sortedClients(){
      return this.clients.slice(0).sort((a,b)=>{
        const latestProjectA = a.latestProject
        const latestProjectB = b.latestProject
        return latestProjectA&&latestProjectB?(latestProjectA.dateLatest>latestProjectB.dateLatest?-1:1):(latestProjectA?-1:1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  section {
    line-height: 160%;
  }
  a { text-decoration: none; }
  .icon-close { color: $colorRed; }
  .icon-mark { color: #CCC; }
  tr>*:first-child { padding-right: 8px; }
  tbody td:last-child i { font-size: 10px; }
</style>