<template>
  <div v-if="tracked">
    <button v-on:click="onSave" :disabled="!saveable">save</button>
    <button v-on:click="onRevert" :disabled="!saveable">revert</button>
    <button v-on:click="onDelete" v-if="deletable">delete</button>
  </div>
</template>

<script>
  import {saveable, save, revert, deleteModel, tracked, untrack} from '@/formState'
  export default {
    name: 'SaveableButtons'
    ,data () {
      return {
        saveable: false
        ,deletable: false
        ,tracked: true
      }
    }
    ,mounted(){
      saveable.add(isSaveable=>this.saveable = isSaveable)
      tracked.add((isTracked,isDeletable)=>{
        this.tracked = isTracked
        this.deletable = isDeletable
      })
    }
    ,methods: {
      onSave: save
      ,onRevert: revert
      ,onDelete: deleteModel
    }
  }
</script>