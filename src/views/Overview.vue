<template>
  <div>
    <section>
      <h1 class="hide-low">Overview</h1>
      <project-list :projects="projects"></project-list>
    </section>
  </div>
</template>

<script>
import BaseView from './BaseView'
import model from '@/model'
import Currency from '@/components/Currency'
import Date from '@/components/Date'
import ProjectList from '@/components/ProjectList'
export default {
  name: 'overview'
  ,extends: BaseView
  ,data () {
    return {
      projects: []
    }
  }
  ,components: {
    Currency
    ,Date
    ,ProjectList
  }
  ,mounted(){
    this.projects = model.clients
        .map(client=>client.projects)
        .reduce((a,b)=>(a.push(...b),a),[])
        .sort((a,b)=>a.paid?1:0)
  }
}
</script>