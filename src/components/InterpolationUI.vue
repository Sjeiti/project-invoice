<template>
  <div>
    <input v-if="!opened" v-on:focus="onFocus" :value="internalValue"></input>
    <div v-else>
      <textarea :value="internalValue" @input="onInput" ref="textarea"></textarea>
      <label v-for="model in models">
        ${<!---->{{model.name}}<!---->}
        <select v-bind:name="model.name" v-on:change="onSelectChange" tabindex="-1"><option v-bind:value="key" v-for="key in model.keys">{{key}}</option></select>
      </label>
      <div class="input" v-html="parse(internalValue)" ref="div"></div>
    </div>
  </div>
</template>

<script>
  import defaultConfig from '@/data/config'
  import defaultData from '@/data/data'
  import {signal} from '@/util/signal'
  import model from '@/model'
  import {create as createClient} from '@/model/client'
  import {parse,__} from '@/util/interpolationService'
  
  const interpolationOpened = signal()
  
  export default {
    name: 'InterpolationUI'
    ,props: ['value']
    ,data () {
      return {
       /* internalValue: this.value
        ,*/models: []
        ,client: {}
        ,project: {}
        ,invoice: {}
        ,opened: false
      }
    }
    ,mounted(){
      // currency data
      this.client = createClient(defaultData.clients[0])
      this.project = this.client.projects[0]
      this.invoice = this.project.invoices[0]
      const models = [
        {name: 'client', model: this.client }
        ,{name: 'project', model: this.project }
        ,{name: 'invoice', model: this.invoice }
        ,{name: 'data', model: model.personal }
      ]
      models.forEach(obj=>{
        const {model} = obj
        const getters = []
        const prototypeOf = Object.getPrototypeOf(model)
        const propertyDescriptors = Object.getOwnPropertyDescriptors(prototypeOf)
        for (let key in propertyDescriptors) {
          const descriptor = propertyDescriptors[key]
          descriptor.get&&getters.push(key)
        }
        getters.push(...Object.getOwnPropertyNames(model).filter(key=>key!=='__ob__'))
        obj.keys = getters.sort()
      })
      this.models = models
      //
      interpolationOpened.add(this.onInterpolationOpened.bind(this))
    }
    ,methods: {
      onFocus(e){
        const {target} = e
        this.opened = true
        interpolationOpened.dispatch(this)
        setTimeout(()=>{
          const {selectionStart,selectionEnd} = target
          const textarea = this.$refs.textarea
          textarea.focus()
          textarea.selectionStart = selectionStart
          textarea.selectionEnd = selectionEnd
          this.$refs.textarea.style.height = `${this.$refs.div.offsetHeight+16}px`;
        })
      }
      ,onInterpolationOpened(ui){
        if (ui!==this) {
          this.opened = false
        }
      }
      ,onInput(e) {
        this.$emit('input', e.target.value)
      }
      ,onSelectChange(e){
        const {target} = e
        const {name,value} = target
        target.value = null
        //
        const textarea = this.$refs.textarea
        const selectionStart = textarea.selectionStart
        const selectionEnd = textarea.selectionEnd
        const valueLength = this.internalValue.length
        //
        if (selectionStart===valueLength) {
          this.internalValue = this.internalValue + `$\{${name}.${value}}`
        } else if (selectionEnd===0) {
          this.internalValue = `$\{${name}.${value}}` + this.internalValue
        } else {
          this.internalValue = this.internalValue.substring(0,selectionStart) + `$\{${name}.${value}}` + this.internalValue.substr(selectionEnd)
        }
        //
      }
      ,parse(key){
        return parse(key,{
            client: this.client
            ,project: this.project
            ,invoice: this.invoice
        })
      }
      ,__
    }
    ,computed: {
      internalValue: {
        get: function(){return this.value}
        ,set: function(value){this.value !== value && this.$emit('input', value)}
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  label {
    position: relative;
    top: -5px;
    display: inline-block;
    padding-right: 10px;
    background-color: transparent;
    cursor: pointer;
  }
  select {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .input {
    margin-bottom: 20px;
    box-shadow: 0 0 0 1px $colorBorder inset,  0 4px 16px $colorShade inset;
    line-height: 140%;
  }
</style>
