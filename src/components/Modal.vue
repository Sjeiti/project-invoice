<template>
  <dialog v-on:close="onClose">
    <form v-on:submit="onSubmit">
      <header>
        <h2>{{title}}</h2>
        <button v-if="cancel!==''" v-on:click="onCancel"><i class="icon-close"></i></button>
        <!--<button v-if="cancel!==''" v-on:click="onCancel"><i class="icon-close"></i></button>-->
      </header>
      <section v-if="(!component&&body)||type==='prompt'||component">
      <!--<section>-->
        <p v-if="!component&&body">{{body}}</p>
        <input v-if="type==='prompt'" v-model="value" type="text" ref="input"/>
        <component v-if="component" :is="component" :data="data">qwer</component>
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
import InvoiceProperties from '../components/InvoiceProperties'

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
 * Show generic modal
 * @param {string} title
 * @param {string} contentClassName
 * @param {object} data
 * @param {string} cancel
 * @param {string} confirm
 * @returns {Promise}
 */
export function modal(title,contentClassName,data,cancel,confirm){
  return new Promise((resolve,reject)=>{
    removeAll()
    sgConfirm.addOnce(resolve)
    sgCancel.addOnce(reject)
    sgModal.dispatch(title,null,cancel,confirm,contentClassName,contentClassName,data)
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
      ,component: null
      ,data: null
    }
  }
  ,mounted(){
    dialogPolyfill.registerDialog(this.$el)
    sgModal.add(this.onModal.bind(this))
    this.$el.addEventListener('transitionend',this.onTransitionEnd.bind(this))
  }
  ,components: {
    InvoiceProperties
  }
  ,methods: {
    onModal(title,body,cancel='cancel',confirm='confirm',type='confirm',component=null,data=null){
      this.title = title||''
      this.body = body||''
      this.cancel = cancel||''
      this.confirm = confirm||''
      this.type = type||'confirm'
      this.component = component||null
      this.data = data||null
      this.value = data||''
      const isPrompt = this.type==='prompt'
      // document.body.style.overflow = 'hidden' // todo: cleanup befor using, width of scrollbar must be replaced with temporary margin if page is scrollable
      setTimeout(()=>isPrompt?this.$refs.input.focus():this.$refs.confirm.focus())
      this.$el.showModal()
      setTimeout(()=>this.$el.classList.add('show'))
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
      this.component = null
      this.data = null
      // document.body.style.removeProperty('overflow') // todo: cleanup befor using, width of scrollbar must be replaced with temporary margin if page is scrollable
    }
    ,close(){
      this.$el.classList.add('hide')
    }
    ,onTransitionEnd(e){
      const {propertyName} = e
      if (propertyName==='transform'&&this.$el.classList.contains('hide')){
        this.$el.classList.remove('hide')
        this.$el.classList.remove('show')
        this.$el.close()
        this.onClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  $borderRadius: 3px;
  $padding: 2*$padding;
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
    background-color: $colorBackground;
    box-shadow: 0 0 0 1px $colorBlue, $shadeFlat;
    border-radius: $borderRadius;
    @media (max-width: 400px) {
      min-width: 10px;
    }
    header {
      display: flex;
      justify-content: space-between;
      background-color: #d9e6e8; // lighten($colorHeader,15%);
      color: $colorText; // $colorBackground;
      border-top-left-radius: $borderRadius;
      border-top-right-radius: $borderRadius;
      box-shadow: 0 1px 0 #a8c8de;
      h2 {
        margin: 0;
        padding: 0.75*$padding 0 0.75*$padding $padding;
        line-height: 100%;
        color: #23323c;
      }
      button {
        flex: 0 0 auto;
        padding: 1rem;
        background-color: transparent;
        box-shadow: none;
        color: #8298b3!important; // $colorText!important; // $colorLink!important;
        margin: 0;
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

  dialog {
    &[open] { transition: opacity 200ms linear, transform 200ms linear; }
    &::backdrop {
      transition: opacity 200ms linear;
    }
    &.show {
      opacity: 1;
      transform: translate(-50%,-50%) scale(1);
      &::backdrop { opacity: 1; }
    }
    &, &.hide {
      opacity: 0;
      transform: translate(-50%,-50%) scale(0.1);
      &::backdrop { opacity: 0; }
    }
  }
  
</style>
