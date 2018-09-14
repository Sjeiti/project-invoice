<template>
  <div>
    <dl>
      <dt v-_>password</dt><dd class="display-flex">
        <input v-model="password1" v-bind:type="showChars&&'text'||'password'" />
        <button type="button" class="icon-stop" v-on:click="showChars=!showChars"></button>
      </dd>
      <dt v-if="enable" v-_>again</dt><dd class="display-flex">
        <input v-model="password2" v-bind:type="showChars&&'text'||'password'" />
        <span v-bind:class="'icon-'+(validate()&&'mark'||'close')"></span>
      </dd>
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
      ,showChars: false
    }
  }
  ,mounted(){
    this.enable = this.data.enable
    // this.index = this.data.index
    console.log('this.data',this.data) // todo: remove log
  }
  ,methods: {
    validate(){
        return this.password1===this.password2&&this.password1.length>2
    }
  }
}
</script>

<style lang="scss" scoped>
  dt { padding-top: 0.4rem; }
</style>
