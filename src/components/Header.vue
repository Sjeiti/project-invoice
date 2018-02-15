<template>
  <header>
    <div class="layout">
      <nav>
        <ul class="list-unstyled list-inline">
          <li>
            <input class="visually-hidden" id="hamburger" type="checkbox">
            <label for="hamburger"><span></span></label>
            <ul class="list-inline">
              <li><router-link to="/">home</router-link></li>
              <li class="drop">
                <label for="drop1"><router-link to="/overview" class="active">overview</router-link></label>
                <input class="visually-hidden" id="drop1" type="checkbox">
                <ul>
                  <li><router-link to="/overview/quarter">quarter</router-link></li>
                </ul>
              </li>
              <li><router-link to="/clients">clients</router-link></li>
              <li class="drop">
                <label for="drop2"><router-link to="/settings">settings</router-link></label>
                <input class="visually-hidden" id="drop2" type="checkbox">
                <ul>
                  <li><router-link to="/layout">layout</router-link></li>
                  <li><router-link to="/data">data</router-link></li>
                  <li><router-link to="/copy">copy</router-link></li>
                </ul>
              </li>
              <li><router-link to="/about">about</router-link></li>
            </ul>
          </li>
        </ul>
      </nav>
      <saveable-buttons class="float-right"></saveable-buttons>
    </div>
  </header>
</template>

<script>
import SaveableButtons from '@/components/SaveableButtons.vue'
export default {
  name: 'AppHeader'
  ,components: {
    SaveableButtons
  }
}
</script>

<style lang="scss" scoped>
  @import '/../variables';
  header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
    padding: $padding/2 0;
    background-color: $colorHeader;
    box-shadow: 0 0 16px $colorHeader;
  }
  .layout {
    display: flex;
    >* { flex: 0 0 auto; }
    nav {
      flex: 1 1 auto;
    }
  }
  a {
    color: #FFF;
    text-decoration: none;
    padding: 0 2px;
  }
  /*.drop {
    position: relative;
    label+input+ul {
      !*display: 1none;*!
    }
    label+input:checked+ul {
      display: block;
      left: 0;
      top: 0;
    }
  }*/

  nav>ul {
    line-height: $headerHeight;
    min-height: $headerHeight;
    >li {
      min-height: 100%;
    }
  }
  /*ul {
    &,*{box-shadow:0 0 0 1px green inset;}
  }*/
  li.drop {
    position: relative;
    label {
      min-height: $headerHeight;
      margin: 0;
      padding: 0;
    }
    ul {
      display: block;
      min-width: 100%;
      overflow: hidden;
      background-color: $colorHeader;
      li:first-child {
        margin-top: -3*$headerHeight;
        transition: margin-top ease 300ms;
      }
    }
    &:hover ul, > input:checked + ul {
      li:first-child {
        margin-top: 0;
      }
    }
    @media (min-width: 768px) {
      ul {
        position: absolute;
        left: 0;
        top: $headerHeight;
      }
    }
  }
</style>
