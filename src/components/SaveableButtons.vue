<template>
  <div>
    <button disabled>save</button>
    <button disabled>revert</button>
    <button disabled>delete</button>
  </div>
</template>

<script>
  import signals from '@/signals'
  export default {
    name: 'SaveableButtons'
    ,props: ['value']
    ,mounted(){
      console.log('signals',signals); // todo: remove log
      signals.foo.add(console.log.bind(console,'foo'))
    }
  }
</script>