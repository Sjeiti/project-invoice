<template>
  <div>
    <dl>
      <dt v-_>password</dt><dd class="display-flex">
        <input v-model="password1" v-bind:type="showChars&&'text'||'password'" />
        <button type="button" v-bind:class="'icon-eye'+(showChars?' slashed':'')" v-on:click="showChars=!showChars"></button>
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
    this.enable&&validSignal.dispatch(false)||validSignal.dispatch(true)
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
  @import '../style/_icons';
  dt { padding-top: 0.4rem; }
  .icon-eye, input+span {
    margin: 0;
  }
  .icon-eye {
    position: relative;
    color: $colorText;
    background-color: transparent;
    box-shadow: none;
    &.slashed {
      &:after {
        @include icon-icon();
        content: $icon-slash;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: $colorRed;
      }
    }
  }
  input+span {
    color: $colorGreen;
    padding: 8px 14px;
    &.icon-close { color: $colorRed; }
  }
</style>
