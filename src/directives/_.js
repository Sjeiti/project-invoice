import Vue from 'vue'
import {sluggify} from '../util/string'

Vue.directive('_',{
  literal: true
  ,bind(el,binding,vnode){
    el.key = binding.value||el.firstChild&&sluggify(el.firstChild.textContent)
    el.firstChild.textContent = vnode.context.$t(el.key)
  }
  ,update(el,binding,vnode){
    el.firstChild.textContent = vnode.context.$t(el.key)
  }
})
