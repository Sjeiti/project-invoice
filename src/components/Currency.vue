<template>
  <div class="input mono">{{value|currency}}</div>
</template>

<script>
export default {
  name: 'Currency'
  ,props: ['value']
}
</script>

<style lang="scss" scoped>
  div {
    white-space: nowrap;
    text-align: right;
    &:before {
      content: '€ ';
    }
    &.text-align-left {
      text-align: left;
    }
  }
</style>
