import Vue from 'vue'
import {sluggify,getFilters} from '../util/string'

const map = new Map()

/**
 * Set the content of an element
 * @param {object} dir
 */
function setContent(dir){
  const {el,vnode,key,filters} = dir
  const text = vnode.context.$t(key)
  if (filters.length&&filters.full){
    el.innerHTML = text
  } else if (el.firstChild){
    el.firstChild.textContent = text
  } else {
    el.appendChild(document.createTextNode(text))
  }
}

Vue.directive('_',{
  literal: true
  ,bind(el,binding,vnode){
    const rawkey = binding.value||el.firstChild&&sluggify(el.firstChild.textContent)
    const {key,filters} = getFilters(rawkey)
    const dir = {el,binding,vnode,key,filters}
    map.set(el,dir)
    setContent(dir)
  }
  ,update(el){
    setContent(map.get(el))
  }
})
