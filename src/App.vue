<template>
  <div id="app">
    <app-header></app-header>
    <div class="layout"><router-view /></div>
    <app-footer></app-footer>
  </div>
</template>

<style lang="scss">
  @import '/variables';
  @import '/_grid';
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:400,700');
  
  html {
    box-sizing: border-box;
  }
  
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  body {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    line-height: 130%;
    background-color: $colorBackground;
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
    padding-top: 40px;
    box-shadow: 0 1px 0 $colorBorder inset;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  button, .btn, input, button, select, textarea, .input {
    margin: 0 2px 4px 0;
    padding: 4px 8px;
    border: 0;
    line-height: 22px;
    &:last-child, &.float-right:first-child {
      margin-right: 0;
    }
  }
  
  button, .btn {
    box-shadow: 0 0 0 1px darken($colorButton,10%) inset,
      1px 1px 0 1px lighten($colorButton,10%) inset,
      0 -2px 8px $colorShade inset;
    background-color: $colorButton;
    color: #FFF;
    text-decoration: none;
    &:hover {
      background-color: lighten($colorButton,10%);
    }
    &:focus {
      box-shadow: 0 0 0 1px darken($colorButton,10%) inset,
        1px 1px 0 1px lighten($colorButton,40%) inset,
        0 -2px 8px $colorShade inset,
        1px 2px 4px rgba(0,0,0,0.4);
    }
    &[disabled] {
      background-color: mix($colorButton,#888,10%);
    }
  }
  
  input, button, select, textarea, .input {
    font-family: inherit;
    font-size: inherit;
    border-radius: 3px;
    &:focus {
      outline: none;
    }
  }
  
  input, textarea {
    border: 0;
    margin-bottom: 4px;
    box-shadow: 0 0 0 1px $colorBorder inset,  0 4px 16px $colorShade inset;
    &[readonly] {
      box-shadow: 0 0 0 1px lighten($colorBorder,20%);
    }
    &:focus {
      box-shadow: 0 0 0 1px $colorButton inset,  0 4px 16px $colorShade inset;
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
    padding: 3px 6px;
    border: 1px solid $colorBorder;
    &:focus {
      border: 1px solid $colorButton;
    }
  }
  
  a {
    color: $colorLink;
  }
  
  table {
    width: 100%;
    border-top: 1px solid $colorBorder;
    border-bottom: 1px solid $colorBorder;
  }
  thead,tfoot { background-color: $colorTable; }
  table, tbody, tfoot, tr, td, th {
    margin:0;
    padding:0;
    border-collapse:collapse;
    border-spacing:0;
  }
  tbody {
    border-top: 2px solid $colorBackground;
  }
  th {
    font-size: 1.1em;
    line-height: 180%;
    font-weight: normal;
    text-align: left;
  }
  td, th {
    padding: 0 1px;
    &:first-child { padding-left: 0; }
    &:last-child { padding-right: 0; }
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
  
  .small, small {
    font-size: 80%;
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
  .text-align-left { text-align: left; }
  .text-align-right { text-align: right; }
  .nowrap { white-space: nowrap; }
  .overflow-hidden { overflow: hidden; }

  .ellipsis {
    position: relative;
    &:before {
      content: '&nbsp;';
      visibility: hidden;
    }
    > span {
      position: absolute;
      left: 0;
      right: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>

<script>
  import AppHeader from '@/components/Header.vue'
  import AppFooter from '@/components/Footer.vue'
  
  export default {
    name: 'app'
    ,components: {
      AppHeader
      ,AppFooter
    }
  }
</script>