<template>
  <div>
    <h1>Client: {{client.name}}</h1>
    <h3>Projects</h3>
    <ul>
      <li v-for="(project, index) in client.projects" :key="project.id">
        <router-link v-bind:to="`/client/${client.nr}/${index}`">{{project.description}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import model from '@/model'

export default {
  name: 'client'
  ,data () {
    return {
      client:{}
    }
  }
  ,mounted(){
    this.client = model.getClientByNr(parseInt(this.$route.params.clientNr,10))
  }
}
</script>

