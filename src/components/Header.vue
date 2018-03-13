<template>
  <header>
    <nav>
      <router-link class="home-icon" v-bind:to="'/'"><logo></logo></router-link>
      <h2 class="page-title hide-high">{{pageTitle}}</h2>
      <ul class="list-unstyled list-inline">
        <li>
          <input v-model="hamburger" class="visually-hidden" id="hamburger" type="checkbox">
          <label for="hamburger"><span></span></label>
          <ul v-on:click="hamburger=!hamburger" class="list-inline">
            <li><router-link to="/">home</router-link></li>
            <li class="drop">
              <label for="drop1"><router-link to="/overview">overview</router-link></label>
              <input class="visually-hidden" id="drop1" type="checkbox">
              <ul>
                <li><router-link to="/overview/quarter">quarter</router-link></li>
              </ul>
            </li>
            <li><router-link to="/clients">clients</router-link></li>
            <li class="drop">
              <label for="drop2"><router-link to="/settings">settings</router-link></label>
              <input class="visually-hidden" id="drop2" type="checkbox">
              <ul>
                <li><router-link to="/layout">layout</router-link></li>
                <li><router-link to="/data">data</router-link></li>
                <li><router-link to="/copy">copy</router-link></li>
              </ul>
            </li>
            <li><router-link to="/about">about</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>
    <saveable-buttons class="saveable-buttons"></saveable-buttons>
  </header>
</template>

<script>
import SaveableButtons from '@/components/SaveableButtons'
import Logo from '@/components/Logo'
import {NAME} from '@/config'
import {swipeLeft,swipeRight} from '../util/signal.swipe'
export default {
  name: 'AppHeader'
  ,data () {
    return {
      hamburger: false
      ,pageTitle: NAME
      ,boundClick: null
    }
  }
  ,components: {
    SaveableButtons
    ,Logo
  }
  ,watch: {
    hamburger(opened){
      if (opened) document.addEventListener('click', this.boundClick, true)
      else document.removeEventListener('click', this.boundClick, true)
    }
  }
  ,mounted(){
    this.pageTitle = this.$route.meta.title
    this.$router.beforeEach((to, from, next) => {
      this.pageTitle = to.meta.title
      next()
    })
    this.boundClick = this.onDocumentClick.bind(this)
    //
    swipeLeft.add(({x})=>(document.body.clientWidth-x)<50&&(this.hamburger=true))
    swipeRight.add(()=>this.hamburger=false)
  }
  ,methods: {
    onDocumentClick(){
      setTimeout(()=>this.hamburger = false, 40)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  
  
  .home-icon {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    float: left;
    height: $headerHeight;
    width: $headerHeight;
    padding: 0;
    /*background: url(/static/img/logo.svg) no-repeat;*/
    /*background-size: 80%;*/
    /*background-position: center;*/
    overflow: hidden;
    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
    @media #{$breakpointHigh} { display: none; }
  }
  
  .page-title {
    position: absolute;
    left: 48px;
    top: 0;
    padding: 0;
    color: white;
    line-height: $headerHeight;
  }
  
  header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    max-width: 100vw;
    max-height: $headerHeight;
    overflow: visible;
    z-index: 2;
    background-color: $colorHeader;
    box-shadow: 0 0 16px $colorHeader;
  }
  a {
      font-size: 14px;
      color: #FFF;
      text-decoration: none;
  }
  
  @media #{$breakpointLow} {
    /*nav>ul {
      width: $headerHeight;
    }*/
    
    nav>ul>li {
      float: right;
      width: 100vw;
      height: $headerHeight;
      text-align: right;
      background-color: $colorHeader;
      a {
        padding: 0 $padding;
        line-height: 300%;
      }
    }
    [for=hamburger] {
      display: block;
      /*width: 100%;*/
      /*float:right;*/
      /*clear: both;*/
      width: $headerHeight/2;
      height: $headerHeight;
      padding: 1px 0;
      margin: 0;
      margin-left: calc(100vw - #{$headerHeight/2});
      &:before, &:after, span {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        margin: 6px 0;
        background-color: white;
        /*background: linear-gradient(90deg, $colorHeader, #eee);*/
      }
    }
    #hamburger+label+ul {
      position: absolute;
      right: 0;
      height: 100vh;
      background: #444 linear-gradient(to right, lighten($colorHeader,5%), $colorHeader);
      overflow: hidden;
      /*max-height: 0;*/
      /*transition: max-height 300ms ease;*/
      transform: translateX(100%);
      transition: transform 300ms ease;
      box-shadow: 0 0 0 $colorHeader;
      li {
        display: block;
      }
      a {
        padding-left: 1rem;
      }
    }
    #hamburger:checked+label+ul {
      transform: translateX(0);
      box-shadow: 0 0 16px $colorHeader;
      /*max-height: 300px;*/
    }
    .saveable-buttons{
      position: absolute;
      right: $headerHeight/2 + $padding;
      top: 0;
      /*float: right;*/
    }
  }
  @media #{$breakpointHigh} {
    $dropPad: 16px;
    ul { font-size: 0; }
    a {
      display: inline-block;
      padding: 0 $dropPad;
      min-height: $headerHeight;
      line-height: $headerHeight;
      transition: background-color 200ms linear;
      &:hover {
        background-color: lighten($colorHeader,5%);
        box-shadow: 100px 0 0 lighten($colorHeader,5%) inset;
      }
      &.router-link-exact-active, &.router-link-exact-active:hover {
        background-color: lighten($colorHeader,10%);
      }
    }
    li.drop {
      min-height: 100%;
      position: relative;
      label {
        min-height: $headerHeight;
        margin: 0;
        padding: 0;
      }
      ul {
        position: absolute;
        left: 0;
        top: $headerHeight;
        display: block;
        min-width: 100%;
        //padding: 0 $dropPad;
        overflow: hidden;
        background-color: $colorHeader;
        li:first-child {
          margin-top: -3*$headerHeight;
          transition: margin-top ease 300ms;
        }
      }
      &:hover ul, > input:checked + ul {
        li:first-child {
          margin-top: 0;
        }
      }
    }
    .saveable-buttons {
      position: absolute;
      right: $padding;
      top: 0;
    }
  }
</style>
