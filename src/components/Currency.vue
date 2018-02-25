<template>
  <div class="input mono" :inner-html.prop="value|currency"></div>
</template>

<script>
export default {
  name: 'Currency'
  ,props: ['value']
  ,filters: {
    currency: val => {
      let dotValue = parseFloat(val||0).toFixed(2)
      const [before,after] = dotValue.split(/\./)
      const reg3 = /(\d)(?=(\d\d\d)+(?!\d))/g
      return before.replace(reg3,'$1<span class="di"></span>')+'<span class="df">.</span>'+after
    }
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
    }
    &.text-align-left {
      text-align: left;
    }
  }
</style>

<style lang="scss">
  .di:before {
    display: inline-block;
    content: '.';
  }
  .df {
    display: inline-block;
    position: relative;
    transform: translateX(-9999rem);
    &:before {
      position: absolute;
      top: 0;
      left: 0;
      content: ',';
      transform: translateX(9999rem);
    }
  }
</style>