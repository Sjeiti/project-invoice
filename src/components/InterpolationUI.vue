<template>
  <div>
    <input v-if="!opened" v-on:focus="onFocus" :value="internalValue"></input>
    <div v-else>
      <textarea :value="internalValue" @input="onInput"></textarea>
      <div>{{parse(internalValue)}}</div>
      <label v-for="model in models">
        ${<!---->{{model.name}}<!---->}
        <select v-bind:name="model.name" v-on:change="onSelectChange"><option v-bind:value="key" v-for="key in model.keys">{{key}}</option></select>
      </label>
    </div>
  </div>
</template>

<script>
  import defaultConfig from '@/data/config'
  import defaultData from '@/data/data'
  import {signal} from '@/signals'
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
      onFocus(){
        this.opened = true
        interpolationOpened.dispatch(this)
      }
      ,onInterpolationOpened(ui){
        if (ui!==this) {
          this.opened = false
        }
      }
      ,onInput(e) {
        const code = e.target.value
        // Atttach validation + sanitization here.
        this.$emit('input', code);
      }
      ,onSelectChange(e){
        const {target} = e
        const {name,value} = target
        this.internalValue = this.internalValue + `$\{${name}.${value}}`
        target.value = null
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
  label {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    padding-right: 10px;
    background-color: transparent;
  }
  select {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
