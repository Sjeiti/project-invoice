<template>
  <div>
    <section data-ngIf="config.homeMessage" class="jumbotron clearfix">
      <p>This invoicing application stores all your data on your local machine.<br/>
      <em><small>Because all your data are belongs to you.</small></em></p>
      <button class="btn btn-sm btn-link float-right" data-click="onHideWelcome()">hide message</button>
    </section>
    <div class="row">
      <section class="col-12 col-md-7">
        <h2>Open invoices</h2>
        <p v-if="invoices.length===0"><em>You currently have no open invoices... yay!</em></p>
        <project-list v-if="invoices.length>0" :projects="invoices" :cols="'paid client amount actions'"></project-list>
      </section>
      <section class="col-12 col-md-5">
        <p>What do you want to do:</p>
        <p><button v-on:click="onAddClient">Create a new client</button></p>
        <p><button v-on:click="onAddProjectForLatestClient" v-if="latestClient">Create project for '{{latestClient.name}}'</button></p>
        <p><button v-on:click="onCloneLatestProject" v-if="latestProject">Clone project '{{latestProject.description}}'</button></p>
        <p><router-link to="/overview/quarter" class="btn">See current quarter</router-link></p>
      </section>
      <section class="col-12 col-md-7">
        <h2>Draft projects</h2>
        <p v-if="drafts.length===0"><em>You currently have no drafts... :-/</em></p>
        <project-list v-if="drafts.length>0" :projects="drafts" :cols="'client description amount actions'"></project-list>
      </section>
    </div>
  </div>
</template>

<script>
import model from '@/model'
import {save} from '@/formState'
import ProjectList from '../components/ProjectList'
export default {
  name: 'home'
  ,components: {ProjectList}
  ,data () {
    return {
      invoices: []
      ,drafts: []
      ,latestProject: []
      ,latestClient: {}
    }
  }
  ,mounted(){
    this.invoices = model.projects.filter(p=>!p.paid&&p.invoices.length)
    this.drafts = model.projects.filter(p=>p.invoices.length===0)
    this.latestProject = model.projects.sort((a,b)=>new Date(a.dateLatest)>new Date(b.dateLatest)?1:-1).pop()
    this.latestClient = model.getClientByNr(this.latestProject.clientNr)
    console.log('this.latestProject',this.latestProject,this.latestProject.dateLatest); // todo: remove log
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
      console.log('onCloneLatestProject'); // todo: remove log
    }
  }
}
</script>
