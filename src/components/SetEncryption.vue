<template>
  <div>
    <dl>
      <dt v-_>password</dt><dd class="display-flex">
        <input v-model="password1" v-bind:type="showChars&&'text'||'password'" />
        <button type="button" class="icon-eye" v-on:click="showChars=!showChars"></button>
      </dd>
      <dt v-if="enable" v-_>again</dt><dd v-if="enable" class="display-flex">
        <input v-model="password2" v-bind:type="showChars&&'text'||'password'" />
        <span v-bind:class="'button icon-'+(validate()&&'mark'||'close')"></span>
      </dd>
    </dl>
  </div>
</template>

<script>
import {valueSignal,validSignal} from './Modal'

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
    this.enable&&validSignal.dispatch(false)
  }
  ,methods: {
    validate(){
      const valid = this.password1===this.password2&&this.password1.length>2
      validSignal.dispatch(valid)
      return valid
    }
  }
  ,watch: {
    password1: function(password){
      valueSignal.dispatch(password)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  dt { padding-top: 0.4rem; }
  .icon-eye, input+span {
    margin: 0;
  }
  .icon-eye {
    color: $colorText;
    background-color: transparent;
    box-shadow: none;
  }
  input+span {
    color: $colorGreen;
    padding: 8px 14px;
    &.icon-close { color: $colorRed; }
  }
</style>
