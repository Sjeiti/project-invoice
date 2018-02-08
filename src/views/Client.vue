<template>
  <div>
    <h1>Client: {{client.name}}</h1>
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
      <ul>
        <li v-for="(project, index) in client.projects" :key="index">
          <router-link v-bind:to="project.uri">
            <span class="mono">{{project.invoiceNr}}</span>
            {{project.id}}
            {{project.description}}
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,save} from '@/formState'
import {create} from '@/model/project'

export default {
  name: 'client'
  ,data () {
    return {
      client:{}
    }
  }
  ,mounted(){
    const client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
    const clientClone = client.clone()
    this.client = clientClone
    track(this.$el,client,clientClone)
  },
  methods: {
    onAddProject(){
      const projectId = Math.max(...this.client.projects.map(p=>p.id)) + 1
      const project = create({
        clientNr: this.client.nr
        ,description: `project ${projectId}`
        ,id: projectId
        ,invoices: []
        ,lines: []
        ,paid: false
      },this.client,this.model)
      const num = this.client.projects.push(project)
      save()
        console.log('onAddProject'
            ,'\n\t',project
            ,'\n\t',project.uri
            ,'\n\t',this.client.projects[num-1].uri); // todo: remove log
//      this.$router.push(project.uri)
    }
  }
}
</script>

