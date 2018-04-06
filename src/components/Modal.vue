<template>
  <dialog>
    <header>
      <h2>{{title}}</h2>
      <button v-on:click="onCancel">&#10006;</button>
    </header>
    <section>
      <p>{{body}}</p>
    </section>
    <footer>
      <button v-on:click="onCancel">{{cancel}}</button>
      <button v-on:click="onConfirm" ref="confirm">{{confirm}}</button>
    </footer>
  </dialog>
</template>

<script>
import dialogPolyfill from 'dialog-polyfill'
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
    }
  }
  ,mounted(){
    dialogPolyfill.registerDialog(this.$el)
    sgModal.add(this.onModal.bind(this))
  }
  ,methods: {
    onModal(title,body,cancel,confirm){
      this.title = title||''
      this.body = body||''
      this.cancel = cancel||'cancel'
      this.confirm = confirm||'confirm'
      this.$el.showModal()
      this.$refs.confirm.focus()
    }
    ,onConfirm(){
      sgConfirm.dispatch()
      this.$el.close()
    }
    ,onCancel(){
      sgCancel.dispatch()
      this.$el.close()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  $borderRadius: 2px;
  dialog {
    padding: 0;
    width: 400px;
    min-width: 300px;
    max-width: 100vw;
    border: 0;
    background-color: #FFF;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border-radius: $borderRadius;
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
    animation: show-backdrop 200ms ease reverse;
  }
  @keyframes show-dialog {
    from {
      opacity: 0;
      transform: scale(0.1);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes show-backdrop {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
</style>
