<template>
  <footer>
    <a href="http://ronvalstar">Made with <span class="love">&#9829;</span></a>
    <span>Project Invoice v2.1.12</span>
    <a href="https://github.com/Sjeiti/project-invoice">Fork on <span class="icon-github"></span></a>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  footer {
    display: flex;
    justify-content: space-between;
    margin: 40px 0 0;
    padding: 4px 8px;
    font-size: 10px;
    text-align: center;
    background-color: $colorHeader;
    box-shadow: 0 1px 0 1px $colorHeader;
    color: #888;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .icon-github {
    display: inline-block;
    transform: translateY(3px);
  }
  .love {
    display: inline-block;
    padding-left: 2px;
    color: $colorRed;
    animation-duration: 500ms;
    animation-name: heartbeat;
    animation-iteration-count: infinite;
  }
  @keyframes heartbeat {
    from { transform: scale(1); }
    to { transform: scale(1.4); }
  }
</style>
