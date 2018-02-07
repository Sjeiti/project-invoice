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
      <div data-saveable-buttons class="float-right">
        <button class="btn-primary" disabled>save</button>
        <button class="btn-primary" disabled>revert</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss" scoped>
  @import '/../variables';
  header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: $padding/2 0;
    background-color: #333;
  }
  .layout {
    display: flex;
    >* { flex: 0 0 auto; }
    nav {
      flex: 1 1 auto;
    }
  }
  ul {
    margin-top: 2px;
  }
  a {
    color: #FFF;
    text-decoration: none;
  }
  .drop {
    position: relative;
    label+input+ul {
      display: none;
    }
    label+input:checked+ul {
      display: block;
      left: 0;
      top: 0;
    }
  }
</style>
