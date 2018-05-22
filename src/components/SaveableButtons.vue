<template>
  <div class="saveable">
    <span v-if="syncing" class="icon-sync"></span>
    <div v-if="tracked">
      <button v-on:click="onSave" :disabled="!saveable"><span class="icon-save hide-high"></span><span class="hide-low" v-_>save</span></button>
      <button v-on:click="onRevert" :disabled="!saveable"><span class="icon-revert hide-high"></span><span class="hide-low" v-_>revert</span></button>
      <button v-on:click="onDelete" v-if="deletable"><span class="icon-delete hide-high"></span><span class="hide-low" v-_>delete</span></button>
    </div>
  </div>
</template>

<script>
  import {saveable,save,revert,deleteModel,tracked} from '../formState'
  import {sync} from '../util/signal'
  import {confirm} from '../components/Modal'
  
  export default {
    name: 'SaveableButtons'
    ,data(){
      return {
        saveable: false
        ,deletable: false
        ,tracked: false
        ,syncing: false
      }
    }
    ,mounted(){
      saveable.add(isSaveable=>this.saveable = isSaveable)
      tracked.add((isTracked,isDeletable)=>{
        this.tracked = isTracked
        this.deletable = isDeletable
      })
      // CTRL save
      document.addEventListener('keydown',e=>{
        if ((e.metaKey||e.ctrlKey)&&e.keyCode===83){
          e.preventDefault()
          this.saveable&&save()
        }
      },false)
      // prevent route change on dirty
      this.$router.beforeEach((to,from,next)=>{
        const nxt = ()=>{
          this.saveable&&revert()
          next()
        }
        this.saveable&&confirm($t('unsavedChanges'),$t('discardChanges'),'cancel','leave')
            .then(nxt,()=>next(false))||nxt()
      })
      // sync
      sync.add(onoff=>{
        this.syncing = onoff
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
  .saveable {
    display:flex;
    margin-top: 5px;
  }
  button { margin-bottom: 0; }
  .icon-sync {
    margin-right: 5px;
    font-size: 1.9rem;
    color: #aaa;
    transform: rotate(0);
		animation: rotation 3000ms infinite linear;
  }
  @-webkit-keyframes rotation {
      from { transform: rotate(0deg); }
      to { transform: rotate(359deg); }
  }
</style>