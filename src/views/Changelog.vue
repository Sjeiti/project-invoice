<template src="./Changelog.html"></template>

<script>
import BaseView from './BaseView'
export default {
  name: 'changelog'
  ,extends: BaseView
}
</script>

<style lang="scss" scoped>
  section + section {
     margin-top: 0;
     padding-top: 0;
     box-shadow: none;
  }
  hr { display: none; }
</style>
