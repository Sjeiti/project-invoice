<template>
  <div id="app">
    <app-header></app-header>
    <div class="layout"><router-view /></div>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import AppHeader from '@/components/Header.vue'
  import AppFooter from '@/components/Footer.vue'
  
  export default {
    name: 'app'
    ,components: {
      AppHeader
      ,AppFooter
    }
  }
</script>

<style lang="scss">
  @import './style/main';
</style>
