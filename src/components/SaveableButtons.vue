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
        ,tracked: false
      }
    }
    ,mounted(){
      saveable.add(isSaveable=>this.saveable = isSaveable)
      tracked.add((isTracked,isDeletable)=>{
        this.tracked = isTracked
        this.deletable = isDeletable
      })
      // CTRL save
      document.addEventListener('keydown', e=>{
        if ((e.metaKey||e.ctrlKey)&&e.keyCode===83) {
          e.preventDefault()
          this.saveable&&save()
        }
      }, false)
      // prevent route change on dirty
      this.$router.beforeEach((to,from,next)=>{
        if (this.saveable&&!confirm('Leave unsaved changes')) {
          next(false)
        } else {
          this.saveable&&revert()
          next()
        }
      })
    }
    ,methods: {
      onSave: save
      ,onRevert: revert
      ,onDelete: deleteModel
    }
  }
</script>

<style lang="scss" scoped>
  div { margin-top: 5px; }
  button { margin-bottom: 0; }
</style>