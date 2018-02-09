<template>
  <div>
    <section data-ngIf="config.homeMessage" class="jumbotron">
      <p>This invoicing application stores all your data on your local machine.<br/>
      <em><small>Because all your data are belongs to you.</small></em></p>
      <button class="btn btn-sm btn-link float-right" data-click="onHideWelcome()">hide message</button>
    </section>
    <div class="row">
      <section class="col-12 col-md-7">
        <h2>Open invoices</h2>
        <p v-if="invoices.length===0"><em>You currently have no open invoices... yay!</em></p>
        <project-list v-if="invoices.length>0" :projects="invoices" :cols="'paid client	amount actions'"></project-list>
      </section>
      <section class="col-12 col-md-5">
        <p>What do you want to do:</p>
        <p><button data-click="onAddClient()" class="btn btn-primary">Create a new client</button></p>
        <p><button data-click="onAddProjectForLatestClient()" data-ngIf="latestClient" class="btn btn-primary">Create project for {-{latestClient.name}}</button></p>
        <p><button data-click="onCloneLatestProject()" data-ngIf="latestProject" class="btn btn-primary">Clone project {-{latestProject.description}}</button></p>
        <p><a routerLink="/overview/quarter" class="btn btn-primary">See current quarter</a></p>
      </section>
    </div>
  </div>
</template>

<script>
import model from '@/model'
import ProjectList from '../components/ProjectList'
export default {
  name: 'home'
  ,components: {ProjectList}
  ,data () {
    return {
      invoices: []
    }
  }
  ,mounted(){
    this.invoices = model.clients
        .map(client=>client.projects)
        .reduce((a,b)=>(a.push(...b),a),[])
        .filter(p=>!p.paid)
  }
}
</script>
