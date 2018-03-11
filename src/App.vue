<template>
  <div id="app">
    <app-header></app-header>
    <div class="layout">
      <router-view />
    </div>
    <app-footer></app-footer>
      <notification></notification>
  </div>
</template>

<script>
  import AppHeader from '@/components/Header.vue'
  import AppFooter from '@/components/Footer.vue'
  import Notification from '@/components/Notification.vue'
  
  export default {
    name: 'app'
    ,components: {
      AppHeader
      ,AppFooter
      ,Notification
    }
  }
</script>

<style lang="scss">
  @import './style/main';
</style>
