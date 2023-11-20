import indexVue from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import signupVue from './pages/signup.vue';
import signinVue from './pages/signin.vue';
import manageVue from './pages/manage.vue';
import manageResident from './pages/manage.resident.vue';
import createResidentVue from './pages/create-resident.vue';

export const routes = [
  {
    name: 'home',
    path: '/',
    component: indexVue,
    meta: {
      title: 'Home',
    },
  },
  {
    name: 'signup',
    path: '/signup',
    component: signupVue,
    meta: {
      title: 'Sign Up',
    },
  },
  {
    name: 'signin',
    path: '/signin',
    component: signinVue,
    meta: {
      title: 'Sign In',
    },
  },
  {
    name: 'signout',
    path: '/signout',
    component: signinVue,
    meta: {
      title: 'Sign Out',
    },
  },
  {
    name: 'manage',
    path: '/manage',
    component: manageVue,
    meta: {
      title: 'Manage',
    },
  },
  {
    name: 'manage-resident',
    path: '/manage/resident/:id',
    component: manageResident,
    meta: {
      title: 'Manage Resident',
    },
  },
  {
    name: 'create-resident',
    path: '/create/resident',
    component: createResidentVue,
    meta: {
      title: 'Create Resident',
    },
  },
  { path: '/:path(.*)', component: NotFound },
];

export default routes;
