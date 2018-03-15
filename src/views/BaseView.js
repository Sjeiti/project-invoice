import {modelReplaced} from '../util/signal'

export default {
  name: 'BaseView'
  ,data () {
    return {
      binds: []
    }
  }
  ,mounted(){
    this.binds.push(modelReplaced.add(()=>{
      // this.$forceUpdate()
      this.$router.push('_')
      this.$router.go(-1)
    }))
  }
  ,destroy(){
    let unbind
    while (unbind = this.binds.pop()) unbind()
  }
}
