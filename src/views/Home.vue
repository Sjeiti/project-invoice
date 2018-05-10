<template>
  <div class="page-home">
    <transition-group name="jumbotron">
      <section v-if="config.homeMessage" class="jumbotron clearfix" :key="'jumbotron'">
        <p v-_="'homeMessage'">This invoicing application stores all your data on your local machine.<br/>
        <em><small v-_="'homeMessageSub'">Because all your data are belong to you.</small></em></p>
        <button class="btn-link float-right" v-on:click="onHideWelcome" v-_>hide message</button>
        <router-link v-bind:to="'/about'" class="btn btn-link float-right" v-_>read more</router-link>
        <logo :colors="['#3B596D','#376677','#2A7F8B']"></logo>
      </section>
    </transition-group>
    <div class="row no-gutters">
      <section class="col-12 col-md-5">
        <h2 v-_>What do you want to do:</h2>
        <p><button v-on:click="onAddClient" v-_>Create a new client</button></p>
        <p><button v-on:click="onAddProjectForLatestClient" v-if="latestClient" v-_>Create project for <span>'{{latestClient.name}}'</span></button></p>
        <p><button v-on:click="onCloneLatestProject" v-if="latestProject" v-_>Clone project <span>'{{latestProject.description}}'</span></button></p>
        <p><router-link to="/overview/quarter" class="btn" v-_>See current quarter</router-link></p>
      </section>
      <section class="col-12 col-md-7">
        <h2 v-_>Open invoices</h2>
        <project-list
            :projects="invoices"
            :cols="'paid date description totalIncDiscounted actions'"
            :empty="'You currently have no open invoices... yay!'"
            :totals="false"
            :animate="true"
        ></project-list>
      </section>
      <section class="col-12 col-md-7">
        <h2 v-_>Draft projects</h2>
        <project-list
            :projects="drafts"
            :cols="'clientName description totalIncDiscounted actions'"
            :empty="'You currently have no drafts... :-/'"
            :totals="false"
        ></project-list>
      </section>
    </div>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import {save} from '../formState'
import ProjectList from '../components/ProjectList'
import Logo from '../components/Logo'
import {projectPaid} from '../util/signal'

export default {
  name: 'home'
  ,extends: BaseView
  ,components: {ProjectList,Logo}
  ,data(){
    return {
      invoices: []
      ,config: model.config
      ,drafts: []
      ,latestProject: []
      ,latestClient: {}
      ,boundSetInvoices: null
    }
  }
  ,mounted(){
    this.setInvoices()
    this.drafts = model.projects.filter(p=>!p.ignore&&p.invoices.length===0)
    this.latestProject = model.projects.sort((a,b)=>new Date(a.dateLatest)>new Date(b.dateLatest)?1:-1).pop()
    this.latestClient = model.getClientByNr(this.latestProject.clientNr)
    this.boundSetInvoices = this.setInvoices.bind(this,1000)
    projectPaid.add(this.boundSetInvoices)
  }
  ,destroyed(){
    projectPaid.remove(this.boundSetInvoices)
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
    ,setInvoices(){
      this.invoices = model.projects.filter(p=>!p.paid&&!p.ignore&&p.invoices.length)
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
    &:before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 100vw;
      height: 100%;
      z-index: 0;
      transform: translateX(-50%);
      background-position: center;
      background-size: cover;
      background-color: #0cbaba;
      background-image: linear-gradient(315deg, #0cbaba 0%, $bgcolor 100%);
    }
    &-enter, &-leave-to {
      transition: transform 300ms linear, margin-bottom 300ms linear;
      transform: translateY(-100%);
      margin-bottom: -220px;
    }
    &, * { color: white; }
    svg {
      z-index: 1;
    }
    p, button, a {
      position: relative;
      z-index: 2;
    }
    p {
      padding: 40px;
    }
    button, a {
      font-size: 12px;
      line-height: 130%;
    }
  }
  
  svg {
    position: absolute;
    left: -4rem;
    bottom: 1rem;
    z-index: -1;
    zoom: 10;
    opacity: 0.4;
  }
  
  section+section {
    margin-top: 0;
    padding-top: 0;
    box-shadow: none;
  }
</style>