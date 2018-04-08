<template>
  <dialog v-on:close="onClose">
    <form v-on:submit="onSubmit">
      <header>
        <h2>{{title}}</h2>
        <button v-if="cancel!==''" v-on:click="onCancel">&#10006;</button>
      </header>
      <section>
        <p>{{body}}</p>
        <input v-model="value" v-if="type==='prompt'" type="text" ref="input"/>
      </section>
      <footer>
        <button v-if="cancel!==''" v-on:click="onCancel" type="button">{{cancel}}</button>
        <button ref="confirm" type="submit">{{confirm}}</button>
      </footer>
    </form>
  </dialog>
</template>

<script>
import dialogPolyfill from 'dialog-polyfill'
//import {nextTick} from '../util'
import {signal} from '../util/signal'

const sgModal = signal()
const sgCancel = signal()
const sgConfirm = signal()

/**
 * Show confirmation modal
 * @param {string} title
 * @param {string} body
 * @param {string} cancel
 * @param {string} confirm
 * @returns {Promise}
 */
export function confirm(title,body,cancel,confirm){
  return new Promise((resolve,reject)=>{
    removeAll()
    sgConfirm.addOnce(resolve)
    sgCancel.addOnce(reject)
    sgModal.dispatch(title,body,cancel,confirm)
  })
}

/**
 * Show prompt modal
 * @param {string} title
 * @param {string} body
 * @param {string} cancel
 * @param {string} confirm
 * @returns {Promise}
 */
export function prompt(title,body,cancel,confirm){
  return new Promise((resolve,reject)=>{
    removeAll()
    sgConfirm.addOnce(resolve)
    sgCancel.addOnce(reject)
    sgModal.dispatch(title,body,cancel,confirm,'prompt')
  })
}

/**
 * Show alert modal
 * @param {string} title
 * @param {string} body
 * @param {string} confirm
 * @returns {Promise}
 */
export function alert(title,body,confirm){
  return new Promise((resolve,reject)=>{
    removeAll()
    sgConfirm.addOnce(resolve)
    sgCancel.addOnce(reject)
    sgModal.dispatch(title,body,'',confirm,'alert')
  })
}

/**
 * Detach all signal listeners
 */
function removeAll(){
  sgCancel.removeAll()
  sgConfirm.removeAll()
}

export default {
  name: 'Modal'
  ,data(){
    return {
      title: 'dialog'
      ,body: 'body'
      ,cancel: 'cancel'
      ,confirm: 'confirm'
      ,type: 'confirm'
      ,value: ''
    }
  }
  ,mounted(){
    dialogPolyfill.registerDialog(this.$el)
    sgModal.add(this.onModal.bind(this))
  }
  ,methods: {
    onModal(title,body,cancel='cancel',confirm='confirm',type='confirm'){
      this.title = title||''
      this.body = body||''
      this.cancel = cancel||''
      this.confirm = confirm||''
      this.type = type||'confirm'
      this.value = ''
      const isPrompt = this.type==='prompt'
      // document.body.style.overflow = 'hidden' // todo: cleanup befor using, width of scrollbar must be replaced with temporary margin if page is scrollable
      setTimeout(()=>isPrompt?this.$refs.input.focus():this.$refs.confirm.focus())
      this.$el.showModal()
    }
    ,onSubmit(e){
      sgConfirm.dispatch(this.value)
      e.preventDefault()
      this.close()
    }
    ,onCancel(){
      sgCancel.dispatch()
      this.close()
    }
    ,onClose(){
      // document.body.style.removeProperty('overflow') // todo: cleanup befor using, width of scrollbar must be replaced with temporary margin if page is scrollable
    }
    ,close(){
      setTimeout(this.$el.close.bind(this.$el))
      this.onClose()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  $borderRadius: 2px;
  dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 0;
    width: 400px;
    min-width: 300px;
    max-width: calc(100vw - 2rem);
    border: 0;
    background-color: #FFF;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border-radius: $borderRadius;
    @media (max-width: 400px) {
      min-width: 10px;
    }
    header {
      display: flex;
      justify-content: space-between;
      h2 {
        margin: 0;
        padding: $padding 0 0 $padding;
        line-height: 100%;
      }
      button {
        flex: 0 0 auto;
        color: black!important;
        background-color: transparent;
        box-shadow: none;
      }
    }
    section {
      padding: $padding;
    }
    footer {
      text-align: right;
      padding: $padding;
      > button {
        margin-bottom: 0;
      }
    }
  }
  dialog::backdrop, dialog + .backdrop {
    background: rgba(0, 0, 0, 0.2);
  }

  
  
  dialog[open] {
    animation: show-dialog 200ms ease normal;
  }
  dialog.hide {
    animation: show-dialog 200ms ease reverse;
  }
  dialog::backdrop {
    animation: none;
  }
  dialog[open]::backdrop {
    animation: show-backdrop 200ms ease normal;
  }
  dialog.hide::backdrop {
    animation: show-bacdrop 200ms ease reverse;
  }
  @keyframes show-dialog {
    from {
      opacity: 0;
      transform: translate(-50%,-50%) scale(0.1);
    }
    to {
      opacity: 1;
      transform: translate(-50%,-50%) scale(1);
    }
  }
  @keyframes show-backdrop {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
</style>
