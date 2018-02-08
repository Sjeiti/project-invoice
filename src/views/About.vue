<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ul>
      <li v-for="client in clients" :key="client.nr">
        {{client.name}}
        <ul>
          <li v-for="project in client.projects" :key="project.id">
            {{project.invoiceNr}} {{project.description}}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import model from '@/model'

export default {
  name: 'about'
}
</script>

