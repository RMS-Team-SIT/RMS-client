import { createRouter, createWebHistory } from 'vue-router';
import UserServices from './services/UserServices';
import { useUserStore } from './stores/user.store';

const index = () => import('@/pages/index.vue');
const NotFound = () => import('@/pages/not-found.vue');
const signup = () => import('@/pages/signup.vue');
const signin = () => import('@/pages/signin.vue');
const signout = () => import('@/pages/signout.vue');
const manage = () => import('@/pages/manage.vue');
const viewResident = () => import('@/pages/resident/view.resident.vue');
const createResident = () => import('@/pages/resident/create.resident.vue');
const profile = () => import('./pages/profile.vue');
const editResidentInfo = () =>
  import('./pages/resident/edit.info.resident.vue');
const forgetPassword = () => import('./pages/forget-password.vue');
const resetPassword = () => import('./pages/reset-password.vue');
const createRental = () => import('./pages/rental/create.rental.vue');
const Temp = () => import('./pages/temp.vue');
const PdfPreview = () => import('./pages/pdf-preview.vue');
const updateRentalVue = () => import('./pages/rental/update.rental.vue');
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
    name: 'manage-resident',
    path: '/manage/resident/:residentId',
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
    path: '/manage/resident/:residentId/update',
    component: editResidentInfo,
    meta: {
      title: 'Update Resident Info',
    },
  },
  {
    name: 'update-resident-info',
    path: '/update/resident/info/:residentId',
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
    name: 'create-rental',
    path: '/manage/resident/:residentId/rental/create',
    component: createRental,
    meta: {
      title: 'Create Rental',
    },
  },
  {
    name: 'update-rental',
    path: '/manage/resident/:residentId/rental/update/:rentalId',
    component: updateRentalVue,
    meta: {
      title: 'Update Rental',
    },
  },
  {
    name: 'temp',
    path: '/temp',
    component: Temp,
    meta: {
      title: 'Create Rental',
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
    path: '/manage/resident/:residentId/room/create',
    component: createRoom,
    meta: {
      title: 'Create Room',
    },
  },
  {
    name: 'update-room',
    path: '/manage/resident/:residentId/room/update/:roomId',
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
