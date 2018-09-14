<template>
  <div>
    <section>
      <h1 class="hide-low" v-_>Settings</h1>
      <dl>
        <dt v-_>application language</dt><dd>
          <select v-model="config.uilang">
            <option v-for="iso in isos" v-bind:value="iso" v-_>{{iso}}</option>
          </select>
        </dd>
        <dt v-title v-_>project number template</dt><dd>
          <InterpolationUI v-model="config.projectNumberTemplate"></InterpolationUI>
        </dd>
        <dt v-title v-_>csv template</dt><dd>
          <InterpolationUI v-model="config.csvTemplate"></InterpolationUI>
        </dd>
        <dt v-title v-_>invoice languages</dt><dd>
          <input v-model="config.langsJoined" />
        </dd>
        <dt v-_>currency</dt><dd>
          <select v-model="config.currency">
            <option v-for="currency in currencies" v-bind:value="currency.code" ngDefaultControl>{{currency.name}} ({{currency.symbol}})</option>
          </select>
        </dd>
        <dt v-_>show home message</dt><dd>
          <label class="checkbox"><input v-model="config.homeMessage" type="checkbox" /><span></span></label>
        </dd>
      </dl>
    </section>
    <section class="row no-gutters">
      <h2 class="col-12 col-sm-3" v-_>data</h2>
      <div class="col-12 col-sm-9">
        <a class="btn" v-on:click="onClickDownload($event,'data')" v-_>download</a>
        <label class="btn" for="restore" v-_>restore</label>
        <input accept="application/json, text/json, .json" type="file" id="restore" v-on:change="onChangeRestore" class="visually-hidden" />
        <button v-on:click="onClickClear" v-_>clear</button>
        <p v-_="'dataExplain|full'">Everything you do in this application is saved to localStorage. You can backup this data by <em>downloading</em> a JSON file. You can use this file to <em>restore</em> the data on any other device or machine.<br/>
        When you <em>clear</em> the data it will be replaced by default data.</p>
      </div>
    </section>
    <section class="row no-gutters">
      <h2 class="col-12 col-sm-3" v-_>cloud sync</h2>
      <div class="col-12 col-sm-9">
        <select v-model="config.cloudSelected" v-bind:disabled="storageService.authorised">
          <option value="" v-_>select cloud</option>
          <option v-for="(storage, key) in storageService.providers" v-bind:value="key" v-_>{{storage.name}}</option>
          <option v-_>(more to come)</option>
        </select>
        <button v-on:click="storageService.init(config.cloudSelected)" v-bind:disabled="storageService.authorised" v-_>authorise</button>
        <button v-on:click="onClickRevoke" v-bind:disabled="!storageService.authorised" v-_>revoke</button>
        <p v-_="'cloudExplain|full'">By default <em>Project Invoice</em> does not send or receive any data. But cloud synchronisation can be convenient if you want to use this application on multiple machines and/or devices. If you authorise a cloud provider the application will check the cloud for newer data when it loads, and save to the cloud every time you save to localStorage.</p>
      </div>
    </section>
    <section class="row no-gutters">
      <h2 class="col-12 col-sm-3" v-_>encryption</h2>
      <div class="col-12 col-sm-9">
        <button v-on:click="disenableEncryption(!isModelEncrypted())" v-bind:disabled="isModelEncrypted()" v-_>enable</button>
        <button v-on:click="disenableEncryption(!isModelEncrypted())" v-bind:disabled="!isModelEncrypted()" v-_>disable</button>
        <p v-_="'encryptionExplain|full'">If you really must have a password you can enable encryption. But use with care: since no servers are used there is no way to reset your password if you forget it.</p>
      </div>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '../model'
import {track,untrack,save} from '../formState'
import {I18N_ISO as isos} from '../config/i18n'
import {CURRENCY_ISO} from '../config/currencyISO'
import InterpolationUI from '../components/InterpolationUI'
import {confirm,modal,prompt} from '../components/Modal'
import storageService from '../service/storage'
import {storageInitialised} from '../util/signal'

const noop = ()=>{}

export default {
  name: 'settings'
  ,extends: BaseView
  ,data(){
    return {
      config: {}
      ,currencies: []
      ,isos
      ,storageService
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
      const $t = this.$t
      confirm(
          $t('clearData')
          ,$t('deleteAllTheData')
          ,$t('noWait')
          ,$t('clear')
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

    ,isModelEncrypted(){
      return model.isEncrypted()
    }

    ,disenableEncryption(enable){
      const $t = this.$t
      modal(enable?$t('enable encryption'):$t('disable encryption'),'SetEncryption',{enable},$t('cancel'),enable?$t('enable'):$t('disable'))
          .then(enable?model.encrypt:model.unEncrypt)
          .then(this.$forceUpdate.bind(this))
      // prompt('asdf','asdf').then(console.log.bind(console,'asdf'),console.log.bind(console,'zxcv'))
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