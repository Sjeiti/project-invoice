<template>
  <div>
    <section>
      <h1 class="hide-low">Settings</h1>
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
    <section>
      <h2>data</h2>
      <p>Everything you do in this application is saved to localStorage. You can backup this data by downloading a JSON file. You can use this file to restore the data on any other device or machine.<br/>
      You can also clear all the data. It will then be replaced by the default data.</p>
      <a class="btn" v-on:click="onClickDownload($event,'data')">download</a>
      <label class="btn" for="restore">restore</label>
      <input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
      <button v-on:click="onClickClear('data')">clear</button>
    </section>
    <section>
      <h2>notifications</h2>
      <p>Push notifications are notifications that can be sent even when the application is closed. But you have to authorise it.</p>
      <button v-bind:disabled="config.notifications" v-on:click="onClickNotifications(true)">enable</button>
      <button v-bind:disabled="!config.notifications" v-on:click="onClickNotifications(false)">disable</button>
      <button v-bind:disabled="!config.notifications" v-on:click="onClickMsg()">msg</button>
    </section>
    <section>
      <h2>cloud synchronisation</h2>
      <p>By default <em>Project Invoice</em> does not send or receive any data. But cloud synchronisation can be convenient if you want to use this application on multiple machines and/or devices. If you authorise a cloud provider the application will check the cloud for newer data when it loads, and save to the cloud every time you save to localStorage.</p>
      <select v-model="config.cloudSelected" v-bind:disabled="storageService.authorised">
        <option value="">select cloud</option>
        <option v-for="(storage, key) in storageService.providers" v-bind:value="key">{{storage.name}}</option>
        <option>(more to come)</option>
      </select>
      <button v-on:click="storageService.init(config.cloudSelected)" v-bind:disabled="storageService.authorised">authorise</button>
      <button v-on:click="onClickRevoke" v-bind:disabled="!storageService.authorised">revoke</button>
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
import notificationService from '../service/notificationService'
import {storageInitialised} from '../util/signal'

export default {
  name: 'settings'
  ,extends: BaseView
  ,data(){
    return {
      config: {}
      ,currencies: []
      ,storageService: storageService
      ,toggle: true
    }
  }
  ,components: { InterpolationUI }
  ,mounted(){
    this.config = track(this.$el,model.config)
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

    ,onClickNotifications(enable){
      console.log('enable',enable) ;// todo: remove log
      // todo store setting in config
      (enable?
          notificationService.requestAndEnable()
          :notificationService.disenable(enable)
      ).then(()=>{
        this.config.notifications = enable
        save()
        this.toggle = !this.toggle
      })
    }

    ,onClickMsg(){
      notificationService.message({body:'test'}).then(console.log.bind(console),console.warn.bind(console))
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
  section p {
    margin-bottom: 1rem;
  }
</style>