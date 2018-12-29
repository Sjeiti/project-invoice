import Vue from 'vue'
// import {EXPLAIN} from '../config/explain'
import {sluggify} from '../util/string'

Vue.directive('title',{
  bind(el,binding,vnode){
    el.keyExplain = binding.value||el.firstChild&&`${sluggify(el.firstChild.textContent)}Explain`||sluggify(el.getAttribute('title'))
    el.setAttribute('title',vnode.context.$t(el.keyExplain)||el.keyExplain)
  }
  ,update(el,binding,vnode){
    el.setAttribute('title',vnode.context.$t(el.keyExplain)||el.keyExplain)
  }
})
