<template>
  <div>
    <section>
      <div class="clearfix">
        <h1>Layout</h1>
        <lang class="float-right"></lang>
      </div>
      <print-invoice :client="client" :project="project" :invoice="invoice" :settings="settings"></print-invoice>
    </section>
    
    <section>
      <dl data-class="row">
        
        <dt data-class="name">Theme</dt><dd>
          <select v-model="settings.theme" data-ngModelChange="onNgModelChanged()">
            <option v-for="theme in settings.themes" v-bind:value="theme">{{theme}}</option>
          </select>
        </dd>
        
        <dt data-class="name colors">Colors</dt><dd>
          <label><input type="color" data-ngModelChange="onNgModelChanged();onChangeVariables()" v-model="settings.themeMainBgColor"/>main background</label><br/>
          <label><input type="color" data-ngModelChange="onNgModelChanged();onChangeVariables()" v-model="settings.themeMainFgColor"/>main foreground</label><br/>
          <label><input type="color" data-ngModelChange="onNgModelChanged();onChangeVariables()" v-model="settings.themeSecondaryBgColor"/>secondary background</label><br/>
          <label><input type="color" data-ngModelChange="onNgModelChanged();onChangeVariables()" v-model="settings.themeSecondaryFgColor"/>secondary foreground</label><br/>
        </dd>
        
        <dt data-class="name">logo</dt><dd>
          <label class="btn btn-secondary btn-sm">add image<input accept="image/gif, image/jpg, image/jpeg, image/png, image/svg, .gif, .jpg, .jpeg, .png, .svg" type="file" data-onChange="onChangeLogo($event)" class="visually-hidden" /></label>
          <button class="btn btn-secondary btn-sm" data-onClick="onDeleteLogo()">delete image</button>
        </dd>
        
        <dt data-class="name wide">invoiceCSS</dt><dd>
          <textarea class="sass" rows="16" data-ngModel="settings.invoiceCSS" data-ngModelChange="onNgModelChanged();onChangeSass(settings.invoiceCSS)"></textarea>
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
import { create as createClient } from '@/model/client'
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
    this.settings = model.config
    //
    console.log('model.config',model.config); // todo: remove log
//    this.populateIframe()
  }
  ,components: {
    Lang
    ,PrintInvoice
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    /*max-width: 50%;*/
  }
</style>
