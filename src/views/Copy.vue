<template>
  <div>
    <section>
      <header>
        <lang class="float-right"></lang>
        <h1>Copy</h1>
      </header>
      <dl>
          <dt><strong>key</strong></dt><dd><strong>value</strong></dd>
      </dl>
      <dl>
        <template v-for="key in sortedCopy">
          <dt>{{key}}</dt>
          <dd><InterpolationUI v-model="copy[key][config.lang]"></InterpolationUI></dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack} from '@/formState'
import Lang from '@/components/Lang.vue'
import InterpolationUI from '@/components/InterpolationUI'
export default {
  name: 'copy'
  ,data () {
    return {
      copy:{}
      ,config: model.config
    }
  }
  ,mounted(){
    this.copy = track(this.$el,model.copy)
  }
  ,computed: {
    sortedCopy() {
      return Object.entries(this.copy).sort(([a,b],[c,d])=>b.index>d.index?1:-1).map(a=>a[0])
    }
  }
  ,destroyed: untrack
  ,components: {
    Lang
    ,InterpolationUI
  }
}
</script>
