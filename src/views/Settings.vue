<template>
  <div>
    <section>
      <h1>Settings</h1>
      <dl>
        <dt>Backup</dt>
        <dd>
          <a v-on:click="onClickDownload($event,'config')" class="btn btn-secondary btn-sm" href="#">config</a>
          <a v-on:click="onClickDownload($event,'data')" class="btn btn-secondary btn-sm" href="#">data</a>
        </dd>
        <dt>Restore</dt>
        <dd>
          <label class="btn btn-secondary btn-sm" for="restore">restore</label><input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
        </dd>
        <dt>Clear</dt>
        <dd>
          <button v-on:click="onClickClear('config')" class="btn btn-secondary btn-sm">config</button>
          <button v-on:click="onClickClear('data')" class="btn btn-secondary btn-sm">data</button>
        </dd>
      </dl>
    </section>
    <section>
      <dl>
        <dt>projectNumberTemplate</dt><dd>
          <input v-model="settings.projectNumberTemplate" />
          <!--<div data-app-interpolationui data-ngModel="settings.projectNumberTemplate"></div>-->
        </dd>
        <dt>csvTemplate</dt><dd>
          <input v-model="settings.csvTemplate" />
          <!--<div data-app-interpolationu data-ngModel="settings.csvTemplate"></div>-->
        </dd>
        <dt>langs</dt><dd>
          <!--<textarea rows="4" v-model="settings.langs"></textarea>-->
          <input v-model="settings.langsJoined" />
        </dd>
        <dt data-ngExplain="'settings.currency'">currency</dt><dd>
          <select v-model="settings.currency">
            <option v-for="currency in currencies" v-bind:value="currency.code" ngDefaultControl>{{currency.name}} ({{currency.symbol}})</option>
          </select>
        </dd>
        <dt>welcome message</dt><dd>{{settings.homeMessage}}
          <input v-model="settings.homeMessage" type="checkbox" />
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
import model from '@/model'
import {track,untrack,revert} from '@/formState'
import {CURRENCY_ISO} from '@/config/currencyISO'
export default {
  name: 'settings'
  ,data () {
    return {
      settings:{}
      ,currencies: []
    }
  }
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
  
    ,onChangeRestore(e, type){
      const target = e.target
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsText(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
            ,resultData = JSON.parse(result)
            ,{type} = resultData
        if (type==='data') {
          model.data = resultData
        } else if (type==='config') {
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
