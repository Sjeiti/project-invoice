import Vue from 'vue'

Vue.directive('_',{
  bind(el,binding,vnode){
    console.log('bind',{el,binding,vnode},this) // todo: remove log
    const key = el.key = binding.value||el.firstChild&&el.firstChild.textContent
    el.firstChild.textContent = vnode.context.$t(key)
  }
  ,update(el,binding,vnode){
    console.log('update',{el,binding,vnode}) // todo: remove log
    el.firstChild.textContent = vnode.context.$t(el.key)
  }
})
