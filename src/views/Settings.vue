<template>
  <div>
    <section>
      <h1 class="hide-low">Settings</h1>
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
    <section>
      <!--<h2>data</h2>-->
      <dl>
        <dt><h2>data</h2></dt><dd class="data">
          <a class="btn" v-on:click="onClickDownload($event,'data')">download</a>
          <label class="btn" for="restore">restore</label>
          <input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
          <button v-on:click="onClickClear('data')">clear</button>
        </dd>
        
        <!--<dt v-explain="'settings.backup'"></dt>
        <dd>
          <a class="btn" v-on:click="onClickDownload($event,'data')">data</a>
        </dd>
        <dt v-explain="'settings.restore'"></dt>
        <dd>
        </dd>
        <dt v-explain="'settings.clear'"></dt>
        <dd>
        </dd>-->
      </dl>
    </section>
    <section>
      <h2>cloud synchronisation</h2>
      <dl>
        <dt>sync</dt>
        <dd>
          <select v-model="settings.cloudSelected" v-bind:disabled="storageService.authorised">
            <option value="">select cloud</option>
            <option v-for="(storage, key) in storageService.providers" v-bind:value="key">{{storage.name}}</option>
          </select>
          <button v-on:click="storageService.init(settings.cloudSelected)" v-bind:disabled="storageService.authorised">authorise</button>
          <button v-on:click="onClickRevoke" v-bind:disabled="!storageService.authorised">revoke</button>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import {track,untrack,save} from '../formState'
import {CURRENCY_ISO} from '../config/currencyISO'
import InterpolationUI from '../components/InterpolationUI'
import storageService from '../service/storage'
import {storageInitialised} from '../util/signal'

export default {
  name: 'settings'
  ,extends: BaseView
  ,data(){
    return {
      settings: {}
      ,currencies: []
      ,storageService: storageService
    }
  }
  ,components: { InterpolationUI }
  ,mounted(){
    this.settings = track(this.$el,model.config)
    this.currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key])
    storageInitialised.add(()=>this.$forceUpdate())
  }
  ,destroyed: untrack
  ,methods: {

    onClickDownload(e,type){
      const currentTarget = e.currentTarget
          ,dataString = JSON.stringify(model.data)
      currentTarget.setAttribute('href',`data:text/json,${encodeURIComponent(dataString)}`)
      currentTarget.setAttribute('download',`${type}.json`)
    }

    ,onChangeRestore(e){
      const target = e.target
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsText(file)
      fileReader.addEventListener('load',()=>{
        const result = fileReader.result
            ,resultData = JSON.parse(result)
        if (resultData.hasOwnProperty('clients')&&resultData.hasOwnProperty('copy')&&resultData.hasOwnProperty('personal')){
          model.data = resultData
        }
        target.value = null
      })
    }

    ,onClickClear(type){
      if (confirm(`Do you really want to clear the ${type}?`)){
          model.data = null
      }
    }

    ,onClickRevoke(){
      this.settings.cloudSelected = ''
      storageService.revoke()
      save()
    }

  }
}
</script>

<style type="text/css" scoped>
  .data {
    transform: translateY(20px);
  }
</style>