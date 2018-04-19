<template>
    <ul class="list-unstyled tabs">
      <li v-for="(tab, i) in tabs" v-on:click="onClick(i)"><h3>{{tab}}</h3></li>
    </ul>
</template>

<script>
export default {
  name: 'Tabs'
  ,props: ['value']
  ,data(){
    return {
      currentTabIndex: 0
      ,tabs: []
    }
  }
  ,beforeMount(){
    //console.log('beforeMount',this.value) // todo: remove log
    this.$slots.default.forEach(vnode=>{
      const {tag,children} = vnode
      tag==='tab'&&children&&children[0]&&this.tabs.push(children&&children[0].text)
    })
    this.tabs.forEach((o,i)=>{
      this.value[i] = false
    })
  }
  /*,mounted(){
    console.log('mounted',this.value) // todo: remove log
    console.log('this',this) // todo: remove log
  }*/
  ,methods: {
    onClick(index){
      //console.log('index',this,index) // todo: remove log
      this.value[this.currentTabIndex] = false
      this.currentTabIndex = index
      this.value[this.currentTabIndex] = true
      this.$emit('input',this.value.slice(0))
    }
  }
  /*,computed: {
    internalValue: {
      get: function(){
        return this.value
      }
      ,set: function(value){
        this.value!==value && this.$emit('input',value)
      }
    }
  }*/
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';

  ul {
    margin: 2.5rem 0 0.5rem;
    border-bottom: 1px solid $colorBorder;
    * {
      display: inline-block;
      line-height: 100%;
      padding: 0;
    }
    li {
      padding: 0.5rem 1rem 0;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border: 1px solid $colorBorder;
      border-bottom: 0;
    }
    
  }
</style>

<style lang="scss">
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
