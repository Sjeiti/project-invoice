<script>
import BaseView from './BaseView'
import model from '../model'
import {track,untrack} from '../formState'
import Lang from '../components/Lang.vue'
import InterpolationUI from '../components/InterpolationUI'
import defaultData from '../data/data'
import draggable from 'vuedraggable'
import {confirm,prompt} from '../components/Modal'

const noop = ()=>{}

export default {
  name: 'copy'
  ,extends: BaseView
  ,data(){
    return {
      copy: model.copy
      ,config: model.config
      ,updateForcer: false
    }
  }
  ,mounted(){
    this.copy = track(this.$el,model.copy)
  }
  ,computed: {
    defaultKeys(){
      this.forceUpdate()
      return Object.keys(defaultData.copy)
    }
    ,customKeys:{
      get: function(){
        const customKeys = Object.keys(this.copy).filter(key=>!this.defaultKeys.includes(key))
        return customKeys.map(key=>[key,this.copy[key]])
             .sort(([a,b],[c,d])=>b.index>d.index?1:-1) // eslint-disable-line no-unused-vars
             .map(a=>a[0])
      }
      ,set: function(order){
        order.forEach((key,index)=>this.copy[key].index = index)
        this.$el.dispatchEvent(new CustomEvent('change'))
      }
    }
  }
  ,methods: {
    onAddCopy(){
      prompt(this.$t('typeAName'),this.$t('theNameIsUsedAsAKey')).then(key=>{
        if (key&&!this.copy.hasOwnProperty(key)){
          this.copy[key] = this.config.langs.reduce((o,s)=>(o[s]='',o),{index:-1})
          this.forceUpdate()
        }
      },()=>{})
    }
    ,onRemoveCopy(key){
      confirm(this.$t('delete'),this.$t('removeCopy'))
          .then(()=>{
            delete this.copy[key]
            this.forceUpdate()
          },noop)
    }
    ,forceUpdate(){
      this.updateForcer = !this.updateForcer
    }
  }
  ,destroyed: untrack
  ,components: {
    Lang
    ,InterpolationUI
    ,draggable
  }
}
</script>

<style lang="scss" scoped>
  dt { white-space: nowrap; }
  dl div {
    display: flex;
    width: 100%;
  }
</style>

<template>
  <div>
    <section>
      <header>
        <lang class="float-right"></lang>
        <h1 class="hide-low" v-_>Copy</h1>
      </header>
      <dl>
          <dt><strong v-_>key</strong></dt><dd><strong v-_>value</strong></dd>
      </dl>
      <dl>
        <template v-for="key in defaultKeys">
          <dt v-_="key"></dt>
          <dd><InterpolationUI v-model="copy[key][config.lang]"></InterpolationUI></dd>
        </template>
      </dl>
      <button v-on:click="onAddCopy">add copy</button>
      <draggable v-model="customKeys" :element="'dl'">
        <div v-for="key in customKeys">
          <dt>
            <i class="icon-drag"></i>
            <button v-on:click="onRemoveCopy(key)">&#10006;</button>
            {{key}}
          </dt>
          <dd>
            <InterpolationUI v-model="copy[key][config.lang]"></InterpolationUI>
          </dd>
        </div>
      </draggable>
    </section>
  </div>
</template>