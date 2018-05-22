<template>
  <div>
    <section>
      <h1 class="hide-low" v-_>Data</h1>
      <dl>
          <dt><strong v-_>key</strong></dt><dd><strong v-_>value</strong></dd>
      </dl>
      <dl>
        <template v-for="(value, key) in personal">
          <dt v-_="key"></dt>
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
import BaseView from './BaseView'
import model from '@/model'
import {track,untrack} from '@/formState'
export default {
  name: 'ddata'
  ,extends: BaseView
  ,data(){
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
