<template>
  <div id="app">
    <app-header></app-header>
    <div class="layout"><router-view /></div>
    <app-footer></app-footer>
  </div>
</template>

<style lang="scss">
  @import '/variables';
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700|Source+Code+Pro:400,700');
  
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  body {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    line-height: 130%;
    background-color: #F8F8F8;
  }

  body, h1, h2, h3, h4, h5, h6, p, ol, ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }
  
  h1, h2, h3, h4, h5, h6 {
    line-height: 140%;
    /*box-shadow: 0 0 0 999px #EEE inset;*/
  }
  h3 { font-size: 22px; }
  
  ol, ul {
    list-style: none;
  }
  
  section+section {
    margin-top: 40px;
    padding-top: 20px;
    box-shadow: 0 1px 0 $colorBorder inset;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  table {
    width: 100%;
  }
  
  button, .btn {
    border: 0;
    box-shadow: 0 0 0 1px darken($colorLink,10%) inset,  0 -2px 8px $colorShade inset;
    background-color: $colorLink;
    color: #FFF;
    border-radius: 3px;
    text-decoration: none;
    &:hover {
      background-color: lighten($colorLink,10%);
    }
  }
  
  input, button, select, textarea, .input {
    margin: 0 0 4px 0;
    padding: 6px 8px;
    font-family: inherit;
    font-size: inherit;
    line-height: 100%;
  }
  
  input, textarea {
    border: 0;
    margin-bottom: 4px;
    box-shadow: 0 0 0 1px $colorBorder,  0 4px 16px $colorShade inset;
    &[readonly] {
      box-shadow: 0 0 0 1px lighten($colorBorder,20%);
    }
  }
  
  textarea {
    width: 100%;
    min-height: 70px;
    line-height: 130%;
  }
  
  input {
    width: 100%;
    &[type=radio], &[type=checkbox] {
      width: 16px;
      height: 16px;
    }
    &[type=number] {
      font-family: 'Source Code Pro', monospace;
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    }
    &[readonly] {
      font-family: 'Source Code Pro', monospace;
      background: transparent;
    }
  }
  
  .mono { font-family: 'Source Code Pro', monospace; }
  
  .btn { @extend .input; }
  
  select {
    padding: 4px 4px;
  }
  
  a {
    color: #46D;
  }
  
  dl {
    display: flex;
    flex-wrap: wrap;
  }
  dt {
    flex: 0 0 100%/12*3;
    //@extend .input;
  }
  dd {
    flex: 0 0 100%/12*9;
    margin: 0;
  }
  
  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    >.layout {
      flex: 1;
      >div {
        padding: 55px 0 $padding;
      }
    }
  }
  
  .layout {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 0 $padding;
  }
  
  .row { display: flex; }
  .col {
    &-1 { flex-basis: 100%/12*1; }
    &-2 { flex-basis: 100%/12*2; }
    &-3 { flex-basis: 100%/12*3; }
    &-4 { flex-basis: 100%/12*4; }
    &-5 { flex-basis: 100%/12*5; }
    &-6 { flex-basis: 100%/12*6; }
    &-7 { flex-basis: 100%/12*7; }
    &-8 { flex-basis: 100%/12*8; }
    &-9 { flex-basis: 100%/12*9; }
    &-10 { flex-basis: 100%/12*10; }
    &-11 { flex-basis: 100%/12*11; }
    &-12 { flex-basis: 100%/12*12; }
  }
  
  .visually-hidden {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px; width: 1px;
    margin: -1px; padding: 0; border: 0;
  }

  .clearfix:after {
    content: '';
    display: block;
    clear: both;
  }
  
  .list-inline {
    >li { display: inline-block; }
  }
  
  .float-right { float: right; }
  .text-align-right { text-align: right; }
</style>

<script>
  import AppHeader from './components/Header.vue'
  import AppFooter from './components/Footer.vue'
  
  export default {
    name: 'app'
    ,components: {
      AppHeader
      ,AppFooter
    }
  }
</script>