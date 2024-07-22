import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  getAllCountries() {
    return apiClient.get('/all');
  },
  getCountryByName(name: string) {
    return apiClient.get(`/name/${name}`);
  },
  getCountriesByRegion(region: string) {
    return apiClient.get(`/region/${region}`);
  },
};
