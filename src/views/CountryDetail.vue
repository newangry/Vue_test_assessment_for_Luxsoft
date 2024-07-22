<template>
    <div :class="['country-detail-container', darkMode ? 'dark-mode' : 'light-mode']">
      <button class="back-button" @click="goBack">Back</button>
      <div class="country-detail">
        <img class="country-flag" :src="country?.flags?.png" alt="flag" />
        <h1 class="country-name">{{ country?.name?.common || 'Country Name' }}</h1>
        <div class="country-info">
          <h2>Native Name: {{ country?.name?.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A' }}</h2>
          <p>Population: {{ country?.population?.toLocaleString() || 'N/A' }}</p>
          <p>Region: {{ country?.region || 'N/A' }}</p>
          <p>Subregion: {{ country?.subregion || 'N/A' }}</p>
          <p>Capital: {{ country?.capital?.[0] || 'N/A' }}</p>
          <p>Top Level Domain: {{ country?.tld?.join(', ') || 'N/A' }}</p>
          <p>Languages: {{ country?.languages ? Object.values(country.languages).join(', ') : 'N/A' }}</p>
          <p>Currencies: {{ country?.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A' }}</p>
          <p>Bordering Countries:</p>
          <div class="border-countries">
            <button v-for="border in borderCountries" :key="border" @click="viewBorderCountry(border)">
              {{ border }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Country } from '../type';
import api from '../api';
//import { useGlobalStateInject } from '../globalState';

export default defineComponent({
  name: 'CountryDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const country = ref<Country | null>(null);
    const darkMode = ref(false);
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
    // watch(searchQuery, (newQuery) => {
    //   clearTimeout(timeout);
    //   timeout = setTimeout(async () => {
    //     //debouncedCorrectSpelling.value = getBestMatch(debouncedCorrectSpelling.value, countries.value);
    //     if(searchQuery.value == '') isFixed = false;
    //     if(searchQuery.value != '' && !isFixed){
    //       searchQuery.value = getBestMatch(searchQuery.value, countries.value);
    //       isFixed = true
    //     }
    //     filteredCountries;
    //   }, 1000);
    // });

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

    // // Compute the filtered countries
    // const filteredCountries = computed((name: string) => {
    //   //const bestMatch = getBestMatch(debouncedCorrectSpelling.value, countries.value);
    //   return countries.value.filter((country) => {
    //     return (
    //       country.name.common.toLowerCase().includes(name.toLowerCase())
    //     );
    //   });
    // });

    const fetchCountry = async (name: string) => {
        try {
            const response = await api.getCountryByName(name);
            country.value = response.data[0];
        } catch (error) {
            console.error('Failed to fetch country details:', error);
        }
        };

    const borderCountries = computed(() => {
        const borders: string[] = [];
        
        // Check if country.value.borders is an array
        if (Array.isArray(country.value?.borders)) {
            // Iterate over the borders array
            for (const border of country.value.borders) {
            // Use getBestMatch to find the best match from countries.value
            const matchedCountry = border//getBestMatch(border, countries.value);

            if (matchedCountry) {
                // Add the matched country's name or any other relevant detail
                borders.push(matchedCountry);
            }
            }
        }

        return borders;
    });

    const viewBorderCountry = (border: string) => {
        //if(filteredCountries(border).length == 0){
            border = getBestMatch(border, countries.value);
        //}
      router.push({ name: 'CountryDetail', params: { name: border } });
    };

    const goBack = () => {
      router.push('/');
    };

    fetchCountry(route.params.name as string);

    return {
      country,
      darkMode,
      borderCountries,
      viewBorderCountry,
      goBack
    };
  }
});
</script>

  
<style scoped>
.country-detail-container {
  margin: 1rem auto;
  max-width: 1200px;
  font-family: 'Nunito Sans', sans-serif;
  background-color: hsl(0, 0%, 90%);
  transition: background-color 0.3s, color 0.3s;
  padding: 1rem;
  border-radius: 8px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  color: hsl(0, 0%, 0%);
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: hsl(0, 0%, 80%);
  color: hsl(0, 0%, 100%);
}

.country-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.country-flag {
  width: 100%;
  max-width: 400px;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.country-name {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: left;
}

.country-info {
  text-align: left;
  line-height: 1.6;
}

.border-countries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.border-countries button {
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.border-countries button:hover {
  background-color: hsl(0, 0%, 80%);
}

.dark-mode {
  background-color: hsl(0, 0%, 10%);
  color: hsl(0, 0%, 100%);
}

.light-mode {
  background-color: hsl(0, 0%, 90%);
  color: hsl(0, 0%, 0%);
}

.white-mode {
  background-color: hsl(0, 0%, 100%);
  color: hsl(0, 0%, 0%);
}

.black-mode {
  background-color: hsl(0, 0%, 20%);
  color: hsl(0, 0%, 100%);
}
</style>
