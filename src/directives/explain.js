import Vue from 'vue'
import {EXPLAIN} from '@/config/explain'

Vue.directive('explain',{
  bind(el,binding){
    const {value} = binding
    const split = value.split('.')
    const [baseKey,key] = split
    const base = EXPLAIN[baseKey]
    const explanation = base&&base[key]||[]
    const [label,title] = explanation
    el.textContent = label||key
    title&&el.setAttribute('title',title)
  }
})