import { createRouter, createWebHistory } from 'vue-router';
import UserServices from './services/UserServices';
import { useUserStore } from './stores/user.store';

const index = () => import('@/pages/index.vue');
const NotFound = () => import('@/pages/not-found.vue');
const signup = () => import('@/pages/signup.vue');
const signin = () => import('@/pages/signin.vue');
const signout = () => import('@/pages/signout.vue');
const manage = () => import('@/pages/manage.vue');
const viewResidence = () => import('@/pages/residence/view.residence.vue');
const createResidence = () => import('@/pages/residence/create.residence.vue');
const profile = () => import('./pages/profile.vue');
const editResidenceInfo = () =>
  import('./pages/residence/edit.info.residence.vue');
const forgetPassword = () => import('./pages/forget-password.vue');
const resetPassword = () => import('./pages/reset-password.vue');
const createRenter = () => import('./pages/renter/create.renter.vue');
const Temp = () => import('./pages/temp.vue');
const PdfPreview = () => import('./pages/pdf-preview.vue');
const updateRenter = () => import('./pages/renter/update.renter.vue');
const verifyEmail = () => import('./pages/verify-email.vue');
const createRoom = () => import('./pages/room/create.room.vue');
const UpdateRoom = () => import('./pages/room/update.room.vue');

const publicPathNames = [
  'home',
  'signup',
  'signin',
  'signout',
  'forget-password',
  'reset-password',
  'verify-email',
];

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
    name: 'manage-residence',
    path: '/manage/residence/:residenceId',
    component: viewResidence,
    meta: {
      title: 'Manage Residence',
    },
  },
  {
    name: 'create-residence',
    path: '/create/residence',
    component: createResidence,
    meta: {
      title: 'Create Residence',
    },
  },
  {
    name: 'update-residence',
    path: '/manage/residence/:residenceId/update',
    component: editResidenceInfo,
    meta: {
      title: 'Update Residence Info',
    },
  },
  {
    name: 'update-residence-info',
    path: '/update/residence/info/:residenceId',
    component: editResidenceInfo,
    meta: {
      title: 'Update Residence',
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
  {
    name: 'forget-password',
    path: '/forget-password',
    component: forgetPassword,
    meta: {
      title: 'Forget Password',
    },
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    component: resetPassword,
    meta: {
      title: 'Reset Password',
    },
  },
  {
    name: 'create-renter',
    path: '/manage/residence/:residenceId/renter/create',
    component: createRenter,
    meta: {
      title: 'Create Renter',
    },
  },
  {
    name: 'update-renter',
    path: '/manage/residence/:residenceId/renter/update/:renterId',
    component: updateRenter,
    meta: {
      title: 'Update Renter',
    },
  },
  {
    name: 'temp',
    path: '/temp',
    component: Temp,
    meta: {
      title: 'Create Renter',
    },
  },
  {
    name: 'pdf-preview',
    path: '/preview/pdf',
    component: PdfPreview,
    meta: {
      title: 'Preview Pdf',
    },
  },
  {
    name: 'verify-email',
    path: '/verify/:token',
    component: verifyEmail,
    meta: {
      title: 'Verify Email',
    },
  },
  {
    name: 'create-room',
    path: '/manage/residence/:residenceId/room/create',
    component: createRoom,
    meta: {
      title: 'Create Room',
    },
  },
  {
    name: 'update-room',
    path: '/manage/residence/:residenceId/room/update/:roomId',
    component: UpdateRoom,
    meta: {
      title: 'Update Room',
    },
  },

  { path: '/:path(.*)', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  // check if the route is public
  if (publicPathNames.includes(to.name)) {
    return next();
  } else {
    //https://pinia.vuejs.org/core-concepts/outside-component-usage.html
    const userStore = useUserStore();
    // fetch user data
    await userStore.fetchUserData();
    // check if the user is logged in from store
    if (userStore.isLoggedIn) {
      return next();
    }
    return next({ name: 'signin' });
  }
});

export default router;
