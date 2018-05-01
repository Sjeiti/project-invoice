import Vue from 'vue'
import {__,loaded} from '../service/i18n'

Vue.directive('__',{
  bind(el,binding){
    const key = binding.value||el.firstChild&&el.firstChild.textContent
    const translate = ()=>el.firstChild.textContent = __(key)
    translate()
    loaded.add(translate)
  }
})