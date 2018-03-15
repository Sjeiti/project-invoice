<template>
  <div>
    <section>
      <header class="clearfix">
        <button v-on:click="onAddClient()" class="float-right">add client</button>
        <h1 class="hide-low">Clients</h1>
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
import BaseView from './BaseView'
import model from '@/model'

export default {
  name: 'clients'
  ,extends: BaseView
  ,data () {
    return {
        clients: model.clients
    }
  }
  ,methods: {
    onAddClient(){
      const client = model.addClient()
      client && this.$router.push(client.uri)
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    line-height: 160%;
  }
  a { text-decoration: none; }
</style>