<template>
  <div>
    <section>
      <header class="clearfix">
        <button v-on:click="onAddClient()" class="float-right">add client</button>
        <h1>Clients</h1>
      </header>
      <ul>
        <li v-for="client in clients" :key="client.nr">
          <router-link v-bind:to="client.uri">{{client.nr}} {{client.name}}</router-link>
        </li>
      </ul>
    </section>
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
  ,methods: {
    onAddClient(){
      const client = model.addClient()
      client && this.$router.push(client.uri)
    }
  }
}
</script>
