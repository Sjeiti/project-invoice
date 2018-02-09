<template>
  <footer><small class="small">v1.4.28</small></footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style lang="scss" scoped>
@import '/../variables';
footer {
  margin: 40px 0 0;
  padding: 4px 0;
  text-align: center;
  background-color: $colorHeader;
  box-shadow: 0 1px 0 1px $colorHeader;
  color: #fff;
}
</style>
