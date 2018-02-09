<template>
  <ul>
    <li>
      <!--<button *ngFor="let _lang of config?.langs" (click)="setLang(_lang)" class="{{_lang===config.lang?'btn-secondary':''}} lang-{{_lang}}">{{_lang}}</button>-->
      <button>en</button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Lang'
}
</script>

<!--<style lang="scss" scoped>
@import '/../variables';
footer {
  margin: 40px 0 0;
  padding: 4px 0;
  text-align: center;
  background-color: $colorHeader;
  box-shadow: 0 1px 0 1px $colorHeader;
  color: #fff;
}
</style>-->
