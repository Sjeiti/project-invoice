<script>
import BaseView from './BaseView'
import model from '@/model'
import {track,untrack} from '@/formState'
import Lang from '@/components/Lang.vue'
import InterpolationUI from '@/components/InterpolationUI'
import defaultData from '../data/data'

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
    ,customKeys(){
      const customKeys = Object.keys(this.copy).filter(key=>!this.defaultKeys.includes(key))
      return customKeys.map(key=>[key,this.copy[key]])
           .sort(([a,b],[c,d])=>b.index>d.index?1:-1) // eslint-disable-line no-unused-vars
           .map(a=>a[0])
    }
  }
  ,methods: {
    onAddCopy(){
      const key = prompt('name?')
      if (key&&!this.copy.hasOwnProperty(key)){
        this.copy[key] = this.config.langs.reduce((o,s)=>(o[s]='',o),{index:-1})
        this.forceUpdate()
      }
    }
    ,onRemoveCopy(key){
      confirm('Do you really want to remove this copy?')&&delete this.copy[key]&&this.forceUpdate()
    }
    ,forceUpdate(){
      this.updateForcer = !this.updateForcer
    }
  }
  ,destroyed: untrack
  ,components: {
    Lang
    ,InterpolationUI
  }
}
</script>

<style lang="scss" scoped>
  dt { white-space: nowrap; }
</style>

<template>
  <div>
    <section>
      <header>
        <lang class="float-right"></lang>
        <h1 class="hide-low">Copy</h1>
      </header>
      <dl>
          <dt><strong>key</strong></dt><dd><strong>value</strong></dd>
      </dl>
      <dl>
        <template v-for="key in defaultKeys">
          <dt v-explain="'copy.'+key"></dt>
          <dd><InterpolationUI v-model="copy[key][config.lang]"></InterpolationUI></dd>
        </template>
      </dl>
      <button v-on:click="onAddCopy">add copy</button>
      <dl>
        <template v-for="key in customKeys">
          <dt>
            <button v-on:click="onRemoveCopy(key)">&#10006;</button>
            {{key}}
          </dt>
          <dd>
            <InterpolationUI v-model="copy[key][config.lang]"></InterpolationUI>
          </dd>
        </template>
      </dl>
    </section>
  </div>
</template>