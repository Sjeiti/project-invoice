<template>
  <div>
    <section>
      <h1 class="hide-low" v-__>Settings</h1>
      <dl>
        <dt v-explain="'config.projectNumberTemplate'"></dt><dd>
          <InterpolationUI v-model="config.projectNumberTemplate"></InterpolationUI>
        </dd>
        <dt v-explain="'config.csvTemplate'"></dt><dd>
          <InterpolationUI v-model="config.csvTemplate"></InterpolationUI>
        </dd>
        <dt v-explain="'config.langs'"></dt><dd>
          <input v-model="config.langsJoined" />
        </dd>
        <dt v-explain="'config.currency'"></dt><dd>
          <select v-model="config.currency">
            <option v-for="currency in currencies" v-bind:value="currency.code" ngDefaultControl>{{currency.name}} ({{currency.symbol}})</option>
          </select>
        </dd>
        <dt v-explain="'config.homeMessage'"></dt><dd>
          <label class="checkbox"><input v-model="config.homeMessage" type="checkbox" /><span></span></label>
        </dd>
      </dl>
    </section>
    <section class="row no-gutters">
      <h2 class="col-12 col-sm-3" v-__>data</h2>
      <div class="col-12 col-sm-9">
        <a class="btn" v-on:click="onClickDownload($event,'data')" v-__>download</a>
        <label class="btn" for="restore" v-__>restore</label>
        <input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
        <button v-on:click="onClickClear" v-__>clear</button>
        <p v-__="'settingsData'">Everything you do in this application is saved to localStorage. You can backup this data by <em>downloading</em> a JSON file. You can use this file to <em>restore</em> the data on any other device or machine.<br/>
        When you <em>clear</em> the data it will be replaced by default data.</p>
      </div>
    </section>
    <section class="row no-gutters">
      <h2 class="col-12 col-sm-3" v-__>cloud sync</h2>
      <div class="col-12 col-sm-9">
        <select v-model="config.cloudSelected" v-bind:disabled="storageService.authorised">
          <option value="" v-__>select cloud</option>
          <option v-for="(storage, key) in storageService.providers" v-bind:value="key">{{storage.name}}</option>
          <option v-__>(more to come)</option>
        </select>
        <button v-on:click="storageService.init(config.cloudSelected)" v-bind:disabled="storageService.authorised" v-__>authorise</button>
        <button v-on:click="onClickRevoke" v-bind:disabled="!storageService.authorised" v-__>revoke</button>
        <p v-__="'settingsCloud'">By default <em>Project Invoice</em> does not send or receive any data. But cloud synchronisation can be convenient if you want to use this application on multiple machines and/or devices. If you authorise a cloud provider the application will check the cloud for newer data when it loads, and save to the cloud every time you save to localStorage.</p>
      </div>
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
import {confirm} from '../components/Modal'

const noop = ()=>{}

export default {
  name: 'settings'
  ,extends: BaseView
  ,data(){
    return {
      config: {}
      ,currencies: []
      ,storageService: storageService
    }
  }
  ,components: { InterpolationUI }
  ,mounted(){
    this.init()
  }
  ,destroyed: untrack
  ,methods: {

    init(){
      this.config = track(this.$el,model.config)
      this.currencies = Object.keys(CURRENCY_ISO).map(key=>CURRENCY_ISO[key])
      storageInitialised.add(()=>this.$forceUpdate()) // todo destroy
    }

    ,onClickDownload(e,type){
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
          this.init()
        }
        target.value = null
      })
    }

    ,onClickClear(){
      confirm(
          'clear data'
          ,'Delete all the data?'
          ,'no wait!'
          ,'clear'
      )
          .then(()=>{
            model.data = null
            this.init()
          },noop)
    }

    ,onClickRevoke(){
      this.config.cloudSelected = ''
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
  section h2 {
    padding-top: 0;
    line-height: 100%;
  }
  section p:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>