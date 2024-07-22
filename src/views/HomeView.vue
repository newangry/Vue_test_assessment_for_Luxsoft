<template>
  <div :class="['home-container', darkMode ? 'dark-mode' : 'light-mode']">
    <header :class="['header', darkMode ? 'black-mode' : 'white-mode']">
      <h1 class="header-title">Where in the world?</h1>
      <button class="mode-toggle" @click="toggleDarkMode">
        <img :src="darkMode ? 'https://img.icons8.com/material-outlined/24/ffffff/moon-symbol.png' : 'https://img.icons8.com/material-outlined/24/000000/moon-symbol.png'" alt="Mode Icon" />
        {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </header>
    <div :class="['container', darkMode ? 'dark-mode' : 'light-mode']">
      <div :class="['search-container', darkMode ? 'dark-mode' : 'light-mode']">
        <div :class="['search-bar', darkMode ? 'black-mode' : 'white-mode']">
          <img src="https://img.icons8.com/material-outlined/24/000000/search.png" alt="Search Icon" />
          <input :class="['search-input', darkMode ? 'black-mode' : 'white-mode']" style="outline: none;" v-model="searchQuery" placeholder="Search for a country" />
        </div>
        <select :class="['region-select', darkMode ? 'balck-mode' : 'white-mode']" style="outline: none;" v-model="selectedRegion">
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <div :class="['countries-container', darkMode ? 'dark-mode' : 'light-mode']">
        <div :class="['country-card', darkMode ? 'black-mode' : 'white-mode']" 
        v-for="country in filteredCountries" :key="country.name.common" @click="viewCountryDetail(country.name.common)">
          <img class="country-flag" :src="country.flags.png" alt="flag" />
          <div class="country-info">
            <h2 class="country-name">{{ country.name.common }}</h2>
            <p class="country-population">Population: {{ country.population.toLocaleString() }}</p>
            <p class="country-region">Region: {{ country.region }}</p>
            <p class="country-capital">Capital: {{ country.capital && country.capital.length ? country.capital[0] : 'N/A' }}</p>
          </div>
        </div>
      </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import api from '../api';
import { Country } from '../type';
import { debounce } from 'lodash';
import { useRouter } from 'vue-router';
import { correctSpelling } from '../Services/spellChecker';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter(); // Initialize router
    const darkMode = ref(false);
    const searchQuery = ref('');
    const selectedRegion = ref('');
    const countries = ref<Country[]>([]);

    api.getAllCountries().then(response => {
      countries.value = response.data;
    }).catch(error => {
      console.error('Failed to fetch countries:', error);
    });

    const debouncedCorrectSpelling = ref('');

    // Debounce the correctSpelling function
    let timeout: ReturnType<typeof setTimeout>;
    let isFixed: Boolean = false;
    watch(searchQuery, (newQuery) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        //debouncedCorrectSpelling.value = getBestMatch(debouncedCorrectSpelling.value, countries.value);
        if(searchQuery.value == '') isFixed = false;
        if(searchQuery.value != '' && !isFixed){
          searchQuery.value = getBestMatch(searchQuery.value, countries.value);
          isFixed = true
        }
        filteredCountries;
      }, 1000);
    });

    // Function to get the best matching country name based on character presence
    const getBestMatch = (query: string, countries: Country[]) => {
      const queryCharCount = getCharCount(query);
      let bestMatch = '';
      let highestScore = -1;

      countries.forEach((country) => {
        const countryName = country.name.common.toLowerCase();
        const countryCharCount = getCharCount(countryName);
        const matchScore = getMatchScore(queryCharCount, countryCharCount);

        if (matchScore > highestScore) {
          highestScore = matchScore;
          bestMatch = country.name.common;
        }
      });

      return bestMatch;
    };

    // Helper function to get character count from a string
    const getCharCount = (str: string) => {
      const charCount: Record<string, number> = {};
      for (const char of str) {
        if (char.trim()) { // ignore spaces
          charCount[char] = (charCount[char] || 0) + 1;
        }
      }
      return charCount;
    };

    // Helper function to get the match score between two character counts
    const getMatchScore = (queryCharCount: Record<string, number>, countryCharCount: Record<string, number>) => {
      let score = 0;
      for (const char in queryCharCount) {
        if (countryCharCount[char]) {
          score += Math.min(queryCharCount[char], countryCharCount[char]);
        }
      }
      return score;
    };

    // Compute the filtered countries
    const filteredCountries = computed(() => {
      //const bestMatch = getBestMatch(debouncedCorrectSpelling.value, countries.value);
      return countries.value.filter((country) => {
        return (
          country.name.common.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
          (selectedRegion.value === '' || country.region === selectedRegion.value)
        );
      });
    });

    const viewCountryDetail = (countryName: string) => {
      router.push({ name: 'CountryDetail', params: { name: countryName } });
    };

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
    };

    return {
      darkMode,
      searchQuery,
      selectedRegion,
      filteredCountries,
      toggleDarkMode,
      viewCountryDetail
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;600;800&display=swap');

.home-container {
  margin:0% 5%;
  font-family: 'Nunito Sans', sans-serif;
  background-color: hsl(0, 0%, 90%);
  transition: background-color 0.3s, color 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: hsl(0, 0%, 100%);
  color: hsl(0, 0%, 0%);
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
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

.container {
  padding : 3.5rem;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30%;
  margin: 1rem 0;
}

.search-bar {
  display: flex;
  width : 250px;
  align-items: center;
  background-color: hsl(0, 0%, 100%);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  flex: 1;
}

.search-bar img {
  margin: 0 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
}

.region-select {
  padding: 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  background-color: hsl(0, 0%, 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 200px;
  box-sizing: border-box;
}

.countries-container {
  display: flex;
  padding: 0;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
}

.country-card {
  background-color: hsl(0, 0%, 100%);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: calc(25% - 1.5rem);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.country-flag {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.country-info {
  padding: 1rem;
  text-align: center;
}

.country-name {
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.country-population,
.country-region,
.country-capital {
  font-size: 1rem;
  margin: 0.5rem 0;
}

.dark-mode {
  background-color: hsl(0, 0%, 10%);
  background-color: rgb(32, 45, 54);
  color: hsl(0, 0%, 100%);
}

.light-mode {
  background-color: hsl(0, 0%, 90%);
  background-color: hsl(43, 55, 67);
  color: hsl(0, 0%, 0%);
}

.white-mode {
  background-color: hsl(0, 0, 100%);
  color: hsl(0, 0%, 0%);
}

.black-mode {
  background-color: hsl(0, 0%, 20%);
  color: hsl(0, 0%, 100%);
}

/* Responsive design */
@media (max-width: 768px) {
  .country-card {
    width: calc(50% - 1.5rem);
  }
}

@media (max-width: 480px) {
  .country-card {
    width: calc(100% - 1.5rem);
  }

  .search-container {
    flex-direction: column;
  }

  .search-bar {
    width: 100%;
  }

  .region-select {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
