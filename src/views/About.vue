<script>
import BaseView from './BaseView'
import FoldableDefinition from '../components/FoldableDefinition'
import Vue from 'vue'
import model from '../model'
import aboutHtml from 'html-loader!../../public/static/i18n/About-en.html'

const components = {FoldableDefinition}

export default {
  name: 'about'
  ,extends: BaseView
  ,components

  ,data(){
    return {
      template: Vue.compile(aboutHtml)
    }
  }
  ,render(createElement){
    return createElement(Object.assign({},this.template,{components}))
  }
  ,mounted(){
    const {uilang} = model.config
    fetch(`/static/i18n/About-${uilang}.html`)
        .then(result=>result.text())
        .then(text=>{
          this.template = Vue.compile(text)
        })
  }
}
</script>

<style lang="scss" scoped>
  div ul {
    list-style: disc;
    padding-left: 20px;
  }
</style>

