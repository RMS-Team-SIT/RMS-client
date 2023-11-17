import indexVue from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import signupVue from './pages/signup.vue';
import signinVue from './pages/signin.vue';
import manageVue from './pages/manage.vue';

export const routes = [
  {
    path: '/',
    component: indexVue,
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
  {
    path: '/manage',
    component: manageVue,
    meta: {
      title: `Manage`,
    },
  },
  { path: '/:path(.*)', component: NotFound },
];


export default routes;
