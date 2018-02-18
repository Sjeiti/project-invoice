<template>
  <div class="input mono">{{value|currency}}</div>
</template>

<script>
export default {
  name: 'Currency'
  ,props: ['value']
  ,filters: {
    currency: val => val&&parseFloat(val).toFixed(2)||0
  }
}
</script>

<style lang="scss" scoped>
  div {
    max-width: 130px;
    position: relative;
    white-space: nowrap;
    text-align: right;
    padding-left: 20px;
    &:before {
      content: '€ ';
      position: absolute;
      left: 0;
      /*float: left;*/
      /*margin-right: 10px;*/
    }
    &.text-align-left {
      text-align: left;
    }
  }
</style>
