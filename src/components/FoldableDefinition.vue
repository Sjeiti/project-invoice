<template><dl v-on:click="onClick"><slot></slot></dl></template>

<script>
export default {
  name: 'foldable-definition'
  ,data(){
    return {
      selected:null
    }
  }
  ,methods: {
    onClick(e){
      const {target} = e
      const {nodeName} = target
      if (nodeName==='DT'){
        this.selected&&this.selected.classList.remove('selected')
        target.classList.add('selected')
        this.selected = target
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/variables';
dl, dd, dt {
  display: block;
}
dt {
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
  &.selected{
    &+dd{
      max-height: 200px;
    }
  }
}
dd {
  transition: max-height 300ms ease;
  margin-bottom: 10px;
  max-height: 0;
  overflow: hidden;
}
</style>
