<template>
  <div id="app">
    <app-header></app-header>
    <div class="layout">
      <router-view />
    </div>
    <app-footer></app-footer>
    <notification></notification>
    <modal></modal>
  </div>
</template>

<script>
  import AppHeader from './components/Header.vue'
  import AppFooter from './components/Footer.vue'
  import Notification from './components/Notification.vue'
  import Modal from './components/Modal.vue'
  
  export default {
    name: 'app'
    ,components: {
      AppHeader
      ,AppFooter
      ,Notification
      ,Modal
    }
  }
</script>

<style lang="scss">
  @import './style/main';
</style>
