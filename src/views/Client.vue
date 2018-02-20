<template>
  <div>
    <h1><span class="hide-low">Client: </span>{{client.name}}</h1>
    <section>
      <dl>
        <dt>name</dt><dd><input v-model="client.name"/></dd>
        <dt>nr</dt><dd><input v-model="client.nr"/></dd>
        <dt>address</dt><dd><input v-model="client.address"/></dd>
        <dt>city</dt><dd><input v-model="client.city"/></dd>
        <dt>contact</dt><dd><input v-model="client.contact"/></dd>
        <dt>paymentterm</dt><dd><input v-model="client.paymentterm"/></dd>
        <dt>phone</dt><dd><input v-model="client.phone"/></dd>
        <dt>postbox</dt><dd><input v-model="client.postbox"/></dd>
        <dt>zipcode</dt><dd><input v-model="client.zipcode"/></dd>
        <dt>zippost</dt><dd><input v-model="client.zippost"/></dd>
      </dl>
    </section>
    
    <section>
      <header class="clearfix">
        <button v-on:click="onAddProject()" class="float-right">add project</button>
        <h3>Projects</h3>
      </header>
      <project-list :projects="client.projects"></project-list>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack,save} from '@/formState'
import {create} from '@/model/project'
import ProjectList from '../components/ProjectList'

export default {
  name: 'client'
  ,data () {
    return {
      client:{}
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
      confirm('Delete this client?') && model.deleteClient(client) && (save(),this.$router.push('/clients'))
    }
  }
}
</script>

