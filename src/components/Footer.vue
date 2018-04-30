<template>
  <footer>
    <a href="http://ronvalstar" v-__>made with <span class="love">&#9829;</span></a>
    <router-link to="/changelog">Project Invoice v{{version}}</router-link>
    <a href="https://github.com/Sjeiti/project-invoice" v-__>fork on &nbsp;<span class="icon-github"></span></a>
  </footer>
</template>

<script>
import {VERSION} from '../config'
export default {
  name: 'AppFooter'
  ,data(){
    return {
      version: VERSION
    }
  }
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
    animation-duration: 861ms;
    animation-name: heartbeat;
    animation-iteration-count: infinite;
  }
  @keyframes heartbeat {
    from { transform: scale(1); }
    to { transform: scale(1.4); }
  }
</style>
