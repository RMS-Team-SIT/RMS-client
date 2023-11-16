import Index from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import signupVue from './pages/signup.vue';
import signinVue from './pages/signin.vue';

export const routes = [
  {
    path: '/',
    component: Index,
    meta: {
      title: `Home`,
    },
  },
  {
    path: '/signup',
    component: signupVue,
    meta: {
      title: `Sign Up`,
    },
  },
  {
    path: '/signin',
    component: signinVue,
    meta: {
      title: `Sign In`,
    },
  },
  { path: '/:path(.*)', component: NotFound },
];

export default routes;
