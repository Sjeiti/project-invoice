<template>
  <div>
    <dl>
      <dt v-_>password</dt><dd><input v-model="password1" type="password" /></dd>
      <dt v-if="enable" v-_>again</dt><dd><input v-model="password2" type="password" /></dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'SetEncryption'
  ,props: ['data']
  ,data(){
    return {
      enable: true
      ,password1: ''
      ,password2: ''
    }
  }
  ,mounted(){
    this.enable = this.data.enable
    // this.index = this.data.index
    console.log('this.data',this.data) // todo: remove log
  }
}
</script>

<style lang="scss" scoped>
  dt { padding-top: 0.4rem; }
</style>
