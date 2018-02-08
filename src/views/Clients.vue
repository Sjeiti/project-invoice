<template>
  <div>
    <h1>Clients</h1>
    <ul>
      <li v-for="client in clients" :key="client.nr">
        <router-link v-bind:to="client.uri">{{client.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import model from '@/model'

export default {
  name: 'clients'
  ,data () {
    return {
        clients: []
    }
  }
  ,mounted(){
    this.clients = model.clients
  }
}
</script>
