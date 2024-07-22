import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import CountryDetail from '../views/CountryDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/country/:name',
    name: 'CountryDetail',
    component: CountryDetail,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
