<template>
  <div class="page-home">
    <section v-if="config.homeMessage" class="jumbotron clearfix">
      <p>This invoicing application stores all your data on your local machine.<br/>
      <em><small>Because all your data are belongs to you.</small></em></p>
      <button class="btn-link float-right" v-on:click="onHideWelcome">hide message</button>
      <router-link v-bind:to="'/about'" class="btn btn-link float-right">read more</router-link>
    </section>
    <div class="row no-gutters">
      <section class="col-12 col-md-5">
        <h2>What do you want to do:</h2>
        <p><button v-on:click="onAddClient">Create a new client</button></p>
        <p><button v-on:click="onAddProjectForLatestClient" v-if="latestClient">Create project for '{{latestClient.name}}'</button></p>
        <p><button v-on:click="onCloneLatestProject" v-if="latestProject">Clone project '{{latestProject.description}}'</button></p>
        <p><router-link to="/overview/quarter" class="btn">See current quarter</router-link></p>
      </section>
      <section class="col-12 col-md-7">
        <h2>Open invoices</h2>
        <p v-if="invoices.length===0"><em>You currently have no open invoices... yay!</em></p>
        <project-list v-if="invoices.length>0" :projects="invoices" :cols="'paid date description totalIncDiscounted actions'" :totals="false" :animate="true"></project-list>
      </section>
      <section class="col-12 col-md-7">
        <h2>Draft projects</h2>
        <p v-if="drafts.length===0"><em>You currently have no drafts... :-/</em></p>
        <project-list v-if="drafts.length>0" :projects="drafts" :cols="'clientName description totalIncDiscounted actions'" :totals="false"></project-list>
      </section>
    </div>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import {save} from '../formState'
import ProjectList from '../components/ProjectList'
import {projectPaid} from '../util/signal'

export default {
  name: 'home'
  ,extends: BaseView
  ,components: {ProjectList}
  ,data(){
    return {
      invoices: []
      ,config: model.config
      ,drafts: []
      ,latestProject: []
      ,latestClient: {}
      ,boundDelayedSetInvoices: null
    }
  }
  ,mounted(){
//    this.invoices = model.projects.filter(p=>!p.paid&&!p.ignore&&p.invoices.length)
    this.delayedSetInvoices()
    this.drafts = model.projects.filter(p=>!p.ignore&&p.invoices.length===0)
    this.latestProject = model.projects.sort((a,b)=>new Date(a.dateLatest)>new Date(b.dateLatest)?1:-1).pop()
    this.latestClient = model.getClientByNr(this.latestProject.clientNr)
    this.boundDelayedSetInvoices = this.delayedSetInvoices.bind(this,1000)
    projectPaid.add(this.boundDelayedSetInvoices)
  }
  ,destroyed(){
    projectPaid.remove(this.boundDelayedSetInvoices)
  }
  ,methods: {
    onAddClient(){
      const client = model.addClient()
      client && this.$router.push(client.uri)
    }
    ,onAddProjectForLatestClient(){
      const project = this.latestClient.createProject()
      project && save()
      this.$router.push(project.uri)
    }
    ,onCloneLatestProject(){
      const project = this.latestProject.cloneNew()
      this.latestProject.client.projects.push(project)
      project && save()
      this.$router.push(project.uri)
    }
    ,onHideWelcome(){
      this.config.homeMessage = false
      save()
    }
    ,delayedSetInvoices(delay=0){
      this.invoices = model.projects.filter(p=>!p.paid&&!p.ignore&&p.invoices.length)
      delay
//      setTimeout(()=>this.invoices = model.projects.filter(p=>!p.paid&&!p.ignore&&p.invoices.length),delay)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  $bgcolor: #3f5267;
  
  .jumbotron {
    display: block;
    position: relative;
    top: -$padding;
    margin-bottom: 40px;
    font-size: 2rem;
    line-height: 130%;
    background-color: $bgcolor;
    box-shadow:
        1000px 0 0 $bgcolor,
        -1000px 0 0 $bgcolor,
        200px 0 0 $bgcolor,
        -200px 0 0 $bgcolor;
    &, * { color: white; }
    p {
      padding: 40px;
    }
    button, a {
      font-size: 12px;
      line-height: 130%;
    }
  }
  
  section+section {
    margin-top: 0;
    padding-top: 0;
    box-shadow: none;
  }
</style>

<style lang="scss">
  /*@import '../style/variables';*/
  /*.page-home .row-select {
    transition: none;
    &.alert-paid {
      opacity: 0;
      transition: opacity 500ms linear 500ms;
    }
  }*/
</style>