<template>
  <div>
    <section>
      <header class="clearfix">
        <lang class="float-right"></lang>
        <h1 class="hide-low">Layout</h1>
      </header>
      <print-invoice :client="client" :project="project" :invoice="invoice" :settings="settings"></print-invoice>
    </section>
    <section>
      <dl data-class="row">
        
        <dt data-class="name">Theme</dt><dd>
          <select v-model="settings.theme">
            <option v-for="theme in settings.themes" v-bind:value="theme">{{theme}}</option>
          </select>
        </dd>
        
        <dt data-class="name colors">Colors</dt><dd>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeMainBgColor"/>main background</label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeMainFgColor"/>main foreground</label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeSecondaryBgColor"/>secondary background</label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeSecondaryFgColor"/>secondary foreground</label><br/>
        </dd>
        
        <dt data-class="name">logo</dt><dd>
          <label class="btn">add image<input accept="image/gif, image/jpg, image/jpeg, image/png, image/svg, .gif, .jpg, .jpeg, .png, .svg" type="file" v-on:change="onChangeLogo" class="visually-hidden" /></label>
          <button class="btn" v-on:click="onDeleteLogo">delete image</button>
        </dd>
        
        <dt data-class="name wide">invoiceCSS</dt><dd>
          <textarea class="sass" rows="16" v-model="settings.invoiceCSS" v-bind:change="onChangeSass(settings.invoiceCSS)"></textarea>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
import Lang from '@/components/Lang.vue'
import PrintInvoice from '@/components/PrintInvoice.vue'
import model from '@/model'
import defaultData from '@/data/data'
import {create as createClient} from '@/model/client'
import {track,untrack,save,saveable} from '@/formState'
import {sassChanged, cssVariablesChanged} from '@/model/css'

export default {
  name: 'layout'
  ,data () {
    return {
      client:{}
      ,project:{}
      ,invoice:{}
      ,settings:{}
      ,pageReady:false
    }
  }
  ,mounted(){
    this.client = createClient(defaultData.clients[0]) // get from dummy
    this.project = this.client.projects[0]
    this.invoice = this.project.invoices[0]
    //
    this.settings = track(this.$el, model.config)
    //
    cssVariablesChanged.dispatch(this.settings)
    // todo trigger cssVariablesChanged on revert
  }
  ,components: {
    Lang
    ,PrintInvoice
  }
  ,destroyed: untrack
  ,methods: {
    
    onChangeVariables(){
      cssVariablesChanged.dispatch(this.settings)
    }
  
    ,onChangeSass(sass){
      sassChanged.dispatch(sass)
    }
  
    ,onChangeLogo(e){
      const target = e.target // as HTMLInputElement
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsDataURL(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
        const img = document.createElement('img')
        img.addEventListener('load', this.onLogoLoad.bind(this, result, img))
        img.setAttribute('src', result)
        target.value = null
      })
    }
  
    ,onDeleteLogo(){
      this.onLogoLoad()
    }
  
    ,onLogoLoad(result, img){
      this.settings.themeLogoCSS = result?`.invoice #logo {
          width: ${img.naturalWidth}px;
          height: ${img.naturalHeight}px;
          background: url(${result}) no-repeat;
      }`:''
      cssVariablesChanged.dispatch(this.settings)
    }
    
  }
}
</script>
