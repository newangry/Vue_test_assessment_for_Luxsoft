<template>

  <router-view/>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { globalState } from './globalState';

export default defineComponent({
  name: 'App',
  setup() {
    provide('globalState', globalState);
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: hsl(0, 0%, 100%);
  color: hsl(0, 0%, 0%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header-title {
  font-size: 1.75rem;
  margin-left: 1.5rem;
}

.mode-toggle {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.mode-toggle img {
  margin-right: 0.5rem;
}

</style>
