<script>
import BaseView from './BaseView'
import Lang from '../components/Lang.vue'
import PrintInvoice from '../components/PrintInvoice.vue'
import model from '../model'
import defaultData from '../data/data'
import {create as createClient} from '../model/client'
import {track,untrack} from '../formState'
import {sassChanged,cssVariablesChanged} from '../model/css'

export default {
  name: 'layout'
  ,extends: BaseView
  ,data(){
    return {
      client:{}
      ,project:{}
      ,invoice:{}
      ,settings:{}
      ,pageReady:false
      ,fonts:[]
    }
  }
  ,mounted(){
    this.client = createClient(defaultData.clients[0]) // get from dummy
    this.project = this.client.projects[0]
    this.invoice = this.project.invoices[0]
    //
    this.settings = track(this.$el,model.config)
    //
    cssVariablesChanged.dispatch(this.settings)
    // todo trigger cssVariablesChanged on revert
    //
    this.getFonts()
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
      fileReader.addEventListener('load',()=>{
        const result = fileReader.result
        const img = document.createElement('img')
        img.addEventListener('load',this.onLogoLoad.bind(this,result,img))
        img.setAttribute('src',result)
        target.value = null
      })
    }

    ,onDeleteLogo(){
      this.onLogoLoad()
    }

    ,onLogoLoad(result,img){
      this.settings.themeLogoCSS = result?`.invoice #logo {
          width: ${img.naturalWidth}px!important;
          height: ${img.naturalHeight}px!important;
          background: url(${result}) no-repeat!important;
      }`:''
      this.onChangeVariables()
    }

    ,getFonts(){
      fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${this.settings.googleFontsAPIKey}`)
          .then(response=>response.json())
          .then(result=>{
            this.fonts = result.items
          })
    }

  }
}
</script>

<template>
  <div>
    <section>
      <header class="clearfix">
        <lang class="float-right"></lang>
        <h1 class="hide-low">Layout</h1>
      </header>
      <print-invoice class="example" :client="client" :project="project" :invoice="invoice" :settings="settings"></print-invoice>

      <dl>
        
        <dt v-_>Theme</dt><dd>
          <select v-model="settings.theme">
            <option v-for="theme in settings.themes" v-bind:value="theme">{{theme}}</option>
          </select>
        </dd>
        
        <dt v-_>logo</dt><dd>
          <label class="btn" v-_>add image<input accept="image/gif, image/jpg, image/jpeg, image/png, image/svg, .gif, .jpg, .jpeg, .png, .svg" type="file" v-on:change="onChangeLogo" class="visually-hidden" /></label>
          <button v-on:click="onDeleteLogo" v-_>delete image</button>
        </dd>
        
        <dt v-_>Colors</dt><dd>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeMainBgColor" /><span v-_>main background</span></label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeMainFgColor" /><span v-_>main foreground</span></label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeSecondaryBgColor" /><span v-_>secondary background</span></label><br/>
          <label><input type="color" v-on:change="onChangeVariables" v-model="settings.themeSecondaryFgColor" /><span v-_>secondary foreground</span></label><br/>
        </dd>
    
        <dt class="name font-size"><label for="font-size" v-_>base font size</label></dt><dd>
            <input class="form-control" id="font-size" type="range" min="5" max="30" step="0.2" v-model="settings.themeFontSize" v-bind:data-reflect="settings.themeFontSize" v-on:change="onChangeVariables" />
        </dd>
        
        <dt class="name"><label for="font-main" v-_>main font</label></dt><dd>
          <select v-model="settings.themeFontMain" v-on:change="onChangeVariables">
            <option v-for="font in fonts" v-bind:value="font.family">{{font.family}}</option>
          </select>
        </dd>
        
        <dt class="name"><label for="font-currency" v-_>currency font</label></dt><dd>
          <select v-model="settings.themeFontCurrency" v-on:change="onChangeVariables">
            <option v-for="font of fonts" data-array-filter=" | arrayFilter:'category=monospace'" v-bind:value="font.family">{{font.family}}</option>
          </select>
        </dd>
        
        <dt v-_>CSS</dt><dd>
          <textarea class="sass" rows="16" v-model="settings.invoiceCSS" v-bind:change="onChangeSass(settings.invoiceCSS)"></textarea>
        </dd>
      </dl>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  @import '../style/variables';
  @media #{$breakpointHigh} {
    .example {
      float: right;
      margin-left: $padding;
    }
  }
</style>
