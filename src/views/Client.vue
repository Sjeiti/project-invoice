<template>
  <div>
    <h1><span class="hide-low" v-_>Client: </span>{{client.name}}</h1>
    <section>
      <dl>
        <dt v-_>name</dt><dd><input v-model="client.name"/></dd>
        <dt v-_>nr</dt><dd><input v-model="client.nr"/></dd>
        <dt v-_>address</dt><dd><input v-model="client.address"/></dd>
        <dt v-_>city</dt><dd><input v-model="client.city"/></dd>
        <dt v-_>contact</dt><dd><input v-model="client.contact"/></dd>
        <dt v-_>paymentterm</dt><dd><input v-model="client.paymentterm"/></dd>
        <dt v-_>phone</dt><dd><input v-model="client.phone"/></dd>
        <dt v-_>postbox</dt><dd><input v-model="client.postbox"/></dd>
        <dt v-_>zipcode</dt><dd><input v-model="client.zipcode"/></dd>
        <dt v-_>zippost</dt><dd><input v-model="client.zippost"/></dd>
      </dl>
    </section>
    
    <section>
      <header>
        <button v-on:click="onAddProject()" class="float-right" v-_>add project</button>
        <h3 v-_>Projects</h3>
      </header>
      <project-list
          :projects="client.projects"
          :cols="'paid nr date dateLatest description totalIncDiscounted'"
          :empty="'This client has no projects :-/'"
      ></project-list>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '@/model'
import {track,untrack,save} from '@/formState'
import ProjectList from '../components/ProjectList'
import {notify} from '../components/Notification'
import {confirm} from '../components/Modal'

export default {
  name: 'client'
  ,extends: BaseView
  ,data(){
    return {
      client:{projects:[]}
    }
  }
  ,mounted(){
    this.client = track(this.$el,model.getClientByNr(parseInt(this.$route.params.clientNr,10)),this.deleteClient)
  }
  ,components: {ProjectList}
  ,destroyed: untrack
  ,methods: {
    onAddProject(){
      const project = this.client.createProject()
      project && save()
      this.$router.push(project.uri)
    }
    ,deleteClient(){
      const client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
      confirm('Delete this client?')
          .then(()=>{
            model.deleteClient(client)
            save()
            this.$router.push('/clients')
            notify(`Client '${client.name}' has been deleted`)
          },()=>{})
    }
  }
}
</script>

