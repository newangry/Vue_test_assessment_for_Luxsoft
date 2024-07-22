<template>
  <div class="country-card">
    <img :src="country.flag" alt="flag" />
    <h3>{{ country.name }}</h3>
    <p>Population: {{ country.population }}</p>
    <p>Region: {{ country.region }}</p>
    <p>Capital: {{ country.capital }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'CountryCard',
  props: {
    country: {
      type: Object as PropType<{ name: string; flag: string; population: number; region: string; capital: string }>,
      required: true,
    },
  },
});
</script>

<style scoped>
.country-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.country-card img {
  width: 100%;
  height: auto;
}
</style>
