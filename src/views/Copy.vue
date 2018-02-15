<template>
  <div>
    <section>
      <h1>Copy</h1>
      <lang class="float-right"></lang>
    </section>
    <section>
      <dl>
          <dt><strong>key</strong></dt><dd><strong>value</strong></dd>
      </dl>
      <dl>
        <template v-for="key in sortedCopy">
          <dt>{{key}}</dt>
          <dd><input v-model="copy[key][config.lang]" /></dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack} from '@/formState'
import Lang from '@/components/Lang.vue'
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
  }
}
</script>
