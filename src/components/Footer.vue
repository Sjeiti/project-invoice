<template>
  <footer><small class="small">v1.4.31</small></footer>
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
  font-size: 10px;
  text-align: center;
  background-color: $colorHeader;
  box-shadow: 0 1px 0 1px $colorHeader;
  color: #888;
}
</style>
