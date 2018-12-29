<template>
  <transition-group tag="ul" name="fade">
    <li
        v-for="notification in notifications"
        :key="notification.key"
        v-on:mouseenter="onMouseEnter(notification)"
        v-on:mouseleave="onMouseLeave(notification)"
    >
      <div v-html="notification.text"></div><button v-on:click="onTransitionEnd(notification)">&#10006;</button>
      <div
          class="timer"
          v-bind:style="notification.style"
          v-bind:class="notification.class"
          v-on:transitionend="onTransitionEnd(notification)"
          v-on:animationend="onTransitionEnd(notification)"
      ></div>
    </li>
  </transition-group>
</template>

<script>
//import {notify} from '../util/signal'

import {/*signal,*/notify as sgNotify} from '../util/signal'
// const sgNotify = signal()

/**
 * Show notification
 * @param {string} notification
 * @returns {Promise}\
 * @todo refactor away, replace by using signals only
 */
export function notify(notification){
  return new Promise((resolve,reject)=>{
//    removeAll()
//    sgConfirm.addOnce(resolve)
//    sgCancel.addOnce(reject)
    sgNotify.dispatch(notification)
    resolve()||reject()
  })
}

const playstatePaused = 'animation-play-state:paused;'

export default {
  name: 'Notification'
  ,data(){
    return {
      notifications: []
    }
  }
  ,mounted(){
    sgNotify.add(this.onNotify.bind(this))
  }
  ,methods: {
    /**
     * Show notification
     * @param {string} text
     * @param {number} t
     */
    onNotify(text,t){
      if (t===undefined) t = Math.max(2000,text.length*70)
      const style = `animation: count-down ${t}ms linear;`
      const notification = {text,t,style,key:Date.now()}
      this.notifications.unshift(notification)
    }
    /**
     * Pause animation on mouse leave
     * @param {object} notification
     */
    ,onMouseEnter(notification){
      notification.style += playstatePaused
      this.$forceUpdate()
    }
    /**
     * Resume animation on mouse leave
     * @param {object} notification
     */
    ,onMouseLeave(notification){
      notification.style = notification.style.replace(playstatePaused,'')
      this.$forceUpdate()
    }
    /**
     * Remove the notification when the animation ends
     * @param {object} notification
     */
    ,onTransitionEnd(notification){
      this.notifications.splice(this.notifications.indexOf(notification),1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../style/variables';
  ul {
    position: fixed;
    left: 0;
    top: $headerHeight;
    z-index: 999;
    width: 100vw;
    color: black;
    box-shadow: 0 0 32px rgba(0,0,0,0.3);
    text-align: center;
  }
  li {
    position: relative;
    display: block;
    padding: 16px 32px;
    box-shadow: 0 1px 0 $colorBlue inset;
    background-color: $colorHeader;
    color: lighten($colorBlue,20%);
    overflow: hidden;
    &:after {
      content: attr(style);
      position: absolute;
      left:0;
      bottom:0;
      font-size: 10px;
    }
    .timer {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 1px;
      background-color: $colorBlue;
    }
    button {
      position: absolute;
      right: $padding;
      top: 50%;
      transform: translateY(-50%);
      background-color: transparent;
      box-shadow: none;
      color: inherit!important;
    }
  }
</style>

<style lang="scss">
  @import '../style/variables';
  $t: 300ms;
  li.fade-enter-active, li.fade-leave-active {
    max-height: 48px;
    padding-top: 16px;
    padding-bottom: 16px;
    transition: max-height $t, padding-top $t, padding-bottom $t;
  }
  li.fade-enter, li.fade-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
  @keyframes count-down {
    from {
      box-shadow: 0 0 0 darken($colorBlue,10%) inset;
    }
  
    to {
      box-shadow: -100vw 0 0 darken($colorBlue,10%) inset;
    }
  }
</style>
