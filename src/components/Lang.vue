<template>
  <ul class="list-inline">
    <li v-for="ng in config.langs">
      <input v-model="config.lang" v-bind:id="ng" v-bind:value="ng" type="radio" name="lang" class="visually-hidden" />
      <label v-bind:for="ng" class="btn">{{ng}}</label>
    </li>
  </ul>
</template>

<script>
import model from '@/model'
export default {
  name: 'Lang'
  ,data () {
    return {
      config: model.config
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
li {
  margin-left: $padding;
}
input {
  &:checked+label.btn, &:checked+label.btn:hover {
    background-color: lighten($colorButton,15%);
  }
}
</style>
