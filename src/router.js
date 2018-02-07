import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import pageClients from './views/Clients.vue'
import pageClient from './views/Client.vue'
import pageProject from './views/Project.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
    // ,{path: '/', component: pageHome}
    // ,{path: '/overview', component: pageOverview}
    // ,{path: '/overview/quarter', component: pageQuarter}
    // ,{path: '/overview/quarter/:year', component: pageQuarter}
    // ,{path: '/overview/year', component: pageOverview}
    // ,{path: '/overview/year/:year', component: pageOverview}
    ,{path: '/clients', component: pageClients}
    ,{path: '/client/:clientNr', component: pageClient}
    ,{path: '/client/:clientNr/:projectIndex', component: pageProject}
    // ,{path: '/client/:clientNr/:projectIndex/quotation', component: InvoiceComponent}
    // ,{path: '/client/:clientNr/:projectIndex/invoice', component: InvoiceComponent}
    // ,{path: '/client/:clientNr/:projectIndex/reminder/:reminderNr', component: InvoiceComponent}
    // ,{path: '/settings', component: pageSettings}
    // ,{path: '/layout', component: LayoutComponent}
    // ,{path: '/data', component: DataComponent}
    // ,{path: '/copy', component: CopyComponent}
    // ,{path: '/about', component: AboutComponent}
    // ,{path: '**', component: Error404Component}
  ]
    ,mode: 'history'
})
