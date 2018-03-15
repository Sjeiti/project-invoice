<template src="./About.html"></template>

<script>
import BaseView from './BaseView'
import FoldableDefinition from '@/components/FoldableDefinition'
export default {
  name: 'about'
  ,extends: BaseView
  ,components: {FoldableDefinition}
}
</script>

<style lang="scss" scoped>
  div ul {
    list-style: disc;
    padding-left: 20px;
  }
</style>

