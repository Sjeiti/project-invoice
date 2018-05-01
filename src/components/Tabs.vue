<template>
    <ul class="list-unstyled tabs">
      <li
          v-for="(tab, i) in tabs"
          v-on:click="onClick(i)"
          v-bind:class="{selected:value[i]}"
      ><h3>{{tab}}</h3></li>
    </ul>
</template>

<script>
export default {
  name: 'Tabs'
  ,props: ['value','index']
  ,data(){
    return { tabs: [] }
  }
  ,beforeMount(){
    this.$slots.default.forEach(vnode=>{
      const {tag,children,data} = vnode
      if (tag==='tab'&&children&&children[0]){
        this.tabs.push(children[0].text)
        const index = this.tabs.length - 1
        this.value[index] = !!data&&data.attrs&&data.attrs.selected!==undefined
      }
    })
  }
  ,watch: {
    index(val){
      this.onClick(val)
    }
  }
  ,methods: {
    onClick(index){
      this.value.forEach((v,i,a)=>a[i]=i===index)
      this.$emit('input',this.value.slice(0))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';

  ul {
    margin: 2.5rem 0 0.5rem;
    //border-bottom: 1px solid $colorBorder;
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    * {
      display: block;
      line-height: 120%;
      padding: 0;
    }
    li {
      $margin: 0.25rem;
      position: relative;
      float: left;
      margin: 0 $margin 0 0;
      padding: 0.5rem 1rem 0;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border: 1px solid $colorBorder;
      background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.01) 70%, rgba(0,0,0,0.05) 100%);
      color: #999;
      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        right: 0;
        display: block;
        width: calc(#{$margin} + 2px);
        height: 1px;
        background-color: $colorBorder;
        transform: translateX(100%);
      }
      &:last-child:after {
        width: 4rem;
        background: transparent linear-gradient(to right, $colorBorder 50%, transparent 100%);
      
      }
      &.selected {
        border-bottom: 0;
        background: none;
        color: #333;
      }
    }
    
  }
</style>

<style lang="scss">
  /* <input class="tabs-trigger" type="checkbox" v-model="tabs[0]" /> */
  .tabs-trigger {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px; width: 1px;
    margin: -1px; padding: 0; border: 0;
    &:not(:checked)+* {
      display: none;
    }
  }
</style>
