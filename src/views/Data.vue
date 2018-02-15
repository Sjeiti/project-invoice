<template>
  <div>
    <section>
      <h1>Data</h1>
      <dl>
          <dt><strong>key</strong></dt><dd><strong>value</strong></dd>
      </dl>
      <dl>
        <template v-for="(value, key) in personal">
          <dt>{{key}}</dt>
          <dd><input v-model="personal[key]" /></dd>
          <!--<dt data-appExplain="'data.'+item.key"></dt>
          <dd><input
              [(ngModel)]="personal[item.key]"
              (ngModelChange)="onNgModelChanged()"
              
              [attr.type]="getAttribute('data.'+item.key,'type')"
              [attr.min]="getAttribute('data.'+item.key,'min')"
              [attr.step]="getAttribute('data.'+item.key,'step')"
              [attr.pattern]="getAttribute('data.'+item.key,'pattern')"
          /></dd>-->
        </template>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack} from '@/formState'
export default {
  name: 'ddata'
  ,data () {
    return {
      personal:{}
    }
  }
  ,mounted(){
    this.personal = track(this.$el,model.personal)
  }
  ,destroyed: untrack
}
</script>
