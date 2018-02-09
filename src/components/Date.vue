<template>
  <div>{{value|date}}</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Date'
  ,props: ['value']
  ,filters: {
    date: (value,mod)=>moment(value).format('YYYY-MM-DD')
  }
}
</script>