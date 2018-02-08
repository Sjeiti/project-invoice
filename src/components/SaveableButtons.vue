<template>
  <div>
    <button v-on:click="onSave" :disabled="!saveable">save</button>
    <button v-on:click="onRevert" :disabled="!saveable">revert</button>
    <button v-on:click="onDelete">delete</button>
  </div>
</template>

<script>
  import {saveable, save, revert, deleteModel} from '@/formState'
  export default {
    name: 'SaveableButtons'
    ,data () {
      return {
        saveable: false
      }
    }
    ,mounted(){
      saveable.add(console.log.bind(console,'saveable'))
      saveable.add(isSaveable=>this.saveable = isSaveable)
    }
    ,methods: {
      onSave: save
      ,onRevert: revert
      ,onDelete: deleteModel
    }
  }
</script>