<template>
  <div>
    <section>
      <h1 class="hide-low">Settings</h1>
      <dl>
        <dt v-explain="'settings.backup'"></dt>
        <dd>
          <button v-on:click="onClickDownload($event,'config')">config</button>
          <button v-on:click="onClickDownload($event,'data')">data</button>
        </dd>
        <dt v-explain="'settings.restore'"></dt>
        <dd>
          <label class="btn" for="restore">restore</label>
          <input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
        </dd>
        <dt v-explain="'settings.clear'"></dt>
        <dd>
          <button v-on:click="onClickClear('config')">config</button>
          <button v-on:click="onClickClear('data')">data</button>
        </dd>
      </dl>
    </section>
    <section>
      <dl>
        <dt v-explain="'settings.projectNumberTemplate'"></dt><dd>
          <InterpolationUI v-model="settings.projectNumberTemplate"></InterpolationUI>
        </dd>
        <dt v-explain="'settings.csvTemplate'"></dt><dd>
          <InterpolationUI v-model="settings.csvTemplate"></InterpolationUI>
        </dd>
        <dt v-explain="'settings.langs'"></dt><dd>
          <input v-model="settings.langsJoined" />
        </dd>
        <dt v-explain="'settings.currency'"></dt><dd>
          <select v-model="settings.currency">
            <option v-for="currency in currencies" v-bind:value="currency.code" ngDefaultControl>{{currency.name}} ({{currency.symbol}})</option>
          </select>
        </dd>
        <dt v-explain="'settings.homeMessage'"></dt><dd>
          <label class="checkbox"><input v-model="settings.homeMessage" type="checkbox" /><span></span></label>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack,revert} from '@/formState'
import {CURRENCY_ISO} from '@/config/currencyISO'
import InterpolationUI from '@/components/InterpolationUI'

export default {
  name: 'settings'
  ,data () {
    return {
      settings:{}
      ,currencies: []
    }
  }
  ,components: { InterpolationUI }
  ,mounted(){
    this.settings = track(this.$el,model.config)
    this.currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key])
  }
  ,destroyed: untrack
  ,methods: {
    
    onClickDownload(e, type){
      const currentTarget = e.currentTarget
          ,isConfig = type==='config'
          ,dataString = JSON.stringify(isConfig?model.config:model.data)
      currentTarget.setAttribute('href', `data:text/json,${encodeURIComponent(dataString)}`)
      currentTarget.setAttribute('download', `${type}.json`)
    }
  
    ,onChangeRestore(e){
      console.log('onChangeRestore',e); // todo: remove log
      const target = e.target
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsText(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
            ,resultData = JSON.parse(result)
        if (resultData.hasOwnProperty('clients')&&resultData.hasOwnProperty('copy')&&resultData.hasOwnProperty('personal')) {
          model.data = resultData
        } else if (resultData.hasOwnProperty('theme')) {
          model.config = resultData
          revert()
        }
        target.value = null
      })
    }
  
    ,onClickClear(type){
      if (confirm(`Do you really want to clear the ${type}?`)) {
        if (type==='data') {
          model.data = null
        } else if (type==='config') {
          model.config = null
          revert()
        }
      }
    }
    
  }
}
</script>
