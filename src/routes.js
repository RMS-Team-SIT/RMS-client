import { createRouter, createWebHistory } from 'vue-router';
import index from '@/pages/index.vue';
import NotFound from '@/pages/not-found.vue';
import signup from '@/pages/signup.vue';
import signin from '@/pages/signin.vue';
import signout from '@/pages/signout.vue';
import manage from '@/pages/manage.vue';
import viewResident from '@/pages/resident/view.resident.vue';
import createResident from '@/pages/resident/create.resident.vue';
import profile from './pages/profile.vue';
import editResidentInfo from './pages/resident/edit.info.resident.vue';

const publicPathNames = ['home', 'signup', 'signin', 'signout'];

const routes = [
  {
    name: 'home',
    path: '/',
    component: index,
    meta: {
      title: 'Home',
    },
  },
  {
    name: 'signup',
    path: '/signup',
    component: signup,
    meta: {
      title: 'Sign Up',
    },
  },
  {
    name: 'signin',
    path: '/signin',
    component: signin,
    meta: {
      title: 'Sign In',
    },
  },
  {
    name: 'signout',
    path: '/signout',
    component: signout,
    meta: {
      title: 'Sign Out',
    },
  },
  {
    name: 'manage',
    path: '/manage',
    component: manage,
    meta: {
      title: 'Manage',
    },
  },
  {
    name: 'manage-resident',
    path: '/manage/resident/:id',
    component: viewResident,
    meta: {
      title: 'Manage Resident',
    },
  },
  {
    name: 'create-resident',
    path: '/create/resident',
    component: createResident,
    meta: {
      title: 'Create Resident',
    },
  },
  {
    name: 'update-resident',
    path: '/update/resident/:id',
    component: editResidentInfo,
    meta: {
      title: 'Update Resident Info',
    },
  },
  {
    name: 'update-resident-info',
    path: '/update/resident/info/:id',
    component: editResidentInfo,
    meta: {
      title: 'Update Resident',
    },
  },
  {
    name: 'profile',
    path: '/profile',
    component: profile,
    meta: {
      title: 'Profile',
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
    return next();
  } else {
    // check if the user is logged in
    const user = localStorage.getItem('token');
    if (!user) {
      return next({ name: 'signin' });
    } else {
      return next();
    }
  }
});

export default router;
