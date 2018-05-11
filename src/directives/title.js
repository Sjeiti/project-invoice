import Vue from 'vue'
// import {EXPLAIN} from '../config/explain'
import {sluggify} from '../util/string'

Vue.directive('title',{
  bind(el,binding,vnode){
    // const {value} = binding
    // const split = value.split('.')
    // const [baseKey,key] = split
    // const base = EXPLAIN[baseKey]
    // const explanation = base&&base[key]||[]
    // const [label,title] = explanation
    // el.textContent = label||key
    // title&&el.setAttribute('title',title)
    //
    //el,binding,vnode){
    el.keyExplain = binding.value||el.firstChild&&`${sluggify(el.firstChild.textContent)}Explain`
    el.setAttribute('title',vnode.context.$t(el.keyExplain)||el.keyExplain)
  }
  ,update(el,binding,vnode){
    el.setAttribute('title',vnode.context.$t(el.keyExplain)||el.keyExplain)
  }
})
