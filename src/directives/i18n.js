import Vue from 'vue'
import {__,loaded} from '../service/i18n'

Vue.directive('__',{
  bind(el/*,binding*/){
    // console.log('el,binding',el,binding) // todo: remove log
    const key = el.firstChild&&el.firstChild.textContent
    console.log('key',`'${key}'`) // todo: remove log
    const translate = ()=>el.firstChild.textContent = __(key)
    translate()
    loaded.add(translate)
  }
})