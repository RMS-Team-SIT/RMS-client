import Index from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import Btns from './pages/btns.vue';

export const routes = [
  { path: '/', component: Index, meta: {
    title: `Home`,
  } },
  { path: '/btns', component: Btns },
  { path: '/:path(.*)', component: NotFound },
];

export default routes;
