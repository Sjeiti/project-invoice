import Vue from 'vue'
import Router from 'vue-router'
import {capitalise} from './util'
import {NAME} from '@/config'

import pageHome from './views/Home.vue'
import pageOverview from './views/Overview.vue'
import pageQuarter from './views/Quarter.vue'
import pageAbout from './views/About.vue'
import pageClients from './views/Clients.vue'
import pageClient from './views/Client.vue'
import pageProject from './views/Project.vue'
import pageInvoice from './views/Invoice.vue'
import pageSettings from './views/Settings.vue'
import pageLayout from './views/Layout.vue'
import pageData from './views/Data.vue'
import pageCopy from './views/Copy.vue'
import page404 from './views/404.vue'

Vue.use(Router)

const routes = [
  {path: '/',component: pageHome,meta: {title:'Project Invoice'}}
  ,{path: '/overview',component: pageOverview}
  ,{path: '/overview/quarter',component: pageQuarter}
  ,{path: '/overview/quarter/:year',component: pageQuarter}
  ,{path: '/overview/year',component: pageOverview}
  ,{path: '/overview/year/:year',component: pageOverview}
  ,{path: '/clients',component: pageClients}
  ,{path: '/client/:clientNr',component: pageClient}
  ,{path: '/client/:clientNr/:projectIndex',component: pageProject}
  ,{path: '/client/:clientNr/:projectIndex/quotation',component: pageInvoice}
  ,{path: '/client/:clientNr/:projectIndex/invoice',component: pageInvoice}
  ,{path: '/client/:clientNr/:projectIndex/reminder/:reminderNr',component: pageInvoice}
  ,{path: '/settings',component: pageSettings}
  ,{path: '/layout',component: pageLayout}
  ,{path: '/data',component: pageData}
  ,{path: '/copy',component: pageCopy}
  ,{path: '/about',component: pageAbout}
  ,{path: '**',component: page404}
]
routes.forEach(route=>{
  const meta = route.meta||(route.meta = {})
  !meta.title&&(meta.title = capitalise(route.component.name))
})

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