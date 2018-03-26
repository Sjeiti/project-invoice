import Vue from 'vue'
import Router from 'vue-router'
import {NAME} from './config'
import routes from './config/routes'

Vue.use(Router)

const router = new Router({
  routes
  ,mode: 'history'
  ,scrollBehavior(to,from,savedPosition){
    if (savedPosition){
      return savedPosition
    } else {
      return {x: 0,y: 0}
    }
  }
})

router.beforeEach((to,from,next)=>{
  const title = to.meta.title
  document.title = title===NAME?NAME:`${title} - ${NAME}`
  next()
})

export default router