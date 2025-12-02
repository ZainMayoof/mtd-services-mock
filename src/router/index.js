import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import BtlDashboard from '../views/btl/BtlDashboard.vue';
import BtlCollector from '../views/btl/BtlCollector.vue';
import PlaceholderView from '../views/PlaceholderView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/btl',
    name: 'btl-dashboard',
    component: BtlDashboard,
  },
  {
    path: '/btl/collector',
    name: 'btl-collector',
    component: BtlCollector,
  },
  // generic placeholder for other menu links
  {
    path: '/placeholder',
    name: 'placeholder',
    component: PlaceholderView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
