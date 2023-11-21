import indexVue from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import signupVue from './pages/signup.vue';
import signinVue from './pages/signin.vue';
import signoutVue from './pages/signout.vue';
import manageVue from './pages/manage.vue';
import manageResident from './pages/manage.resident.vue';
import createResidentVue from './pages/create-resident.vue';
import { createRouter, createWebHistory } from 'vue-router';

const publicPathNames = ['home', 'signup', 'signin', 'signout'];

const routes = [
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
    component: signoutVue,
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

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PUBLIC_PATH),
  routes,
});

router.beforeEach((to, from, next) => {
  // check if the route is public
  if (publicPathNames.includes(to.name)) {
    console.log('public path');
    return next();
  } else {
    // check if the user is logged in
    const user = localStorage.getItem('token');
    console.log('loggedIn', user);
    if (!user) {
      return next({ name: 'signin' });
    } else {
      return next();
    }
  }
});

export default router;
