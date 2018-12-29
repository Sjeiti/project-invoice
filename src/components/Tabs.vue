<template>
    <ul class="list-unstyled tabs">
      <li
          v-for="(tab, i) in tabs"
          v-on:click="onClick(i)"
          v-bind:class="{selected:value[i]}"
      ><h3 v-_>{{tab}}</h3></li>
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

<!--<style lang="scss" scoped>
  @import '../style/variables';
</style>-->

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
