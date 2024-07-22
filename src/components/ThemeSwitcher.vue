<template>
  <button @click="toggleTheme">Switch Theme</button>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    const theme = ref('light');

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme.value);
    };

    return {
      toggleTheme,
    };
  },
};
</script>

<style>
:root[data-theme='light'] {
  --bg-color: white;
  --text-color: black;
}

:root[data-theme='dark'] {
  --bg-color: black;
  --text-color: white;
}
</style>
