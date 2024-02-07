import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user.store';

const index = () => import('@/pages/index.vue');
const NotFound = () => import('@/pages/not-found.vue');
const signup = () => import('@/pages/signup.vue');
const signin = () => import('@/pages/signin.vue');
const signout = () => import('@/pages/signout.vue');
const manage = () => import('@/pages/manage.vue');

const PdfPreview = () => import('./pages/pdf-preview.vue');

const profile = () => import('./pages/profile.vue');
const verifyEmail = () => import('./pages/verify-email.vue');
const forgetPassword = () => import('./pages/forget-password.vue');
const resetPassword = () => import('./pages/reset-password.vue');

const dashboard = () => import('./pages/residence/dashboard.vue');
const info = () => import('@/pages/residence/info.vue');
const createResidence = () => import('@/pages/residence/create.vue');
const updateResidenceInfo = () => import('./pages/residence/update.info.vue');

const renter = () => import('./pages/residence/renter/renter.vue');
const createRenter = () => import('./pages/residence/renter/create.vue');
const updateRenter = () => import('./pages/residence/renter/update.vue');

const room = () => import('./pages/residence/room/room.vue');
const createRoom = () => import('./pages/residence/room/create.vue');
const updateRoom = () => import('./pages/residence/room/update.vue');

const payment = () => import('./pages/residence/payment/payment.vue');
const createPayment = () => import('./pages/residence/payment/create.vue');
const updatePayment = () => import('./pages/residence/payment/update.vue');

const bill = () => import('./pages/residence/bill-system/index.vue');

const meterRecord = () => import('./pages/residence/meter-record/index.vue');
const createMeterRecord = () =>
  import('./pages/residence/meter-record/create.vue');

const publicRoutes = [
  'home',
  'signup',
  'signin',
  'forget-password',
  'reset-password',
  'verify-email',
  'upload',
];

const restrictedRoutesForLoggedInUsers = [
  'home',
  'signup',
  'signin',
  'forget-password',
  'reset-password',
];

const routes = [
  {
    name: 'home',
    path: '/',
    component: index,
    meta: {
      title: 'หน้าแรก',
    },
  },
  {
    name: 'signup',
    path: '/signup',
    component: signup,
    meta: {
      title: 'สมัครสมาชิก',
    },
  },
  {
    name: 'signin',
    path: '/signin',
    component: signin,
    meta: {
      title: 'เข้าสู่ระบบ',
    },
  },
  {
    name: 'signout',
    path: '/signout',
    component: signout,
    meta: {
      title: 'ออกจากระบบ',
    },
  },
  {
    name: 'manage',
    path: '/manage',
    component: manage,
    meta: {
      title: 'จัดการ',
    },
  },
  {
    name: 'create-residence',
    path: '/create/residence',
    component: createResidence,
    meta: {
      title: 'สร้างหอพัก',
    },
  },
  {
    name: 'update-residence',
    path: '/manage/residence/:residenceId/update',
    component: updateResidenceInfo,
    meta: {
      title: 'Update Residence Info',
    },
  },
  {
    name: 'update-residence-info',
    path: '/update/residence/info/:residenceId',
    component: updateResidenceInfo,
    meta: {
      title: 'Update Residence',
    },
  },
  {
    name: 'profile',
    path: '/profile',
    component: profile,
    meta: {
      title: 'ข้อมูลส่วนตัว',
    },
  },
  {
    name: 'forget-password',
    path: '/forget-password',
    component: forgetPassword,
    meta: {
      title: 'ลืมรหัสผ่าน',
    },
  },
  {
    name: 'reset-password',
    path: '/reset-password/:token',
    component: resetPassword,
    meta: {
      title: 'รีเซทรหัสผ่าน',
    },
  },
  {
    name: 'create-renter',
    path: '/manage/residence/:residenceId/renter/create',
    component: createRenter,
    meta: {
      title: 'สร้างผู้เช่า',
    },
  },
  {
    name: 'update-renter',
    path: '/manage/residence/:residenceId/renter/update/:renterId',
    component: updateRenter,
    meta: {
      title: 'อัปเดตผู้เช่า',
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
      title: 'ยืนยันอีเมล',
    },
  },
  {
    name: 'create-room',
    path: '/manage/residence/:residenceId/room/create',
    component: createRoom,
    meta: {
      title: 'สร้างห้องพัก',
    },
  },
  {
    name: 'update-room',
    path: '/manage/residence/:residenceId/room/update/:roomId',
    component: updateRoom,
    meta: {
      title: 'อัปเดตห้องพัก',
    },
  },
  {
    name: 'dashboard',
    path: '/manage/residence/:residenceId/dashboard',
    component: dashboard,
    meta: {
      title: 'แดชบอร์ด',
    },
  },
  {
    name: 'payment',
    path: '/manage/residence/:residenceId/payment',
    component: payment,
    meta: {
      title: 'จัดการช่องทางการชำระเงิน',
    },
  },
  {
    name: 'renter',
    path: '/manage/residence/:residenceId/renter',
    component: renter,
    meta: {
      title: 'จัดการผู้เช่า',
    },
  },
  {
    name: 'room',
    path: '/manage/residence/:residenceId/room',
    component: room,
    meta: {
      title: 'จัดการห้องพัก',
    },
  },
  {
    name: 'info',
    path: '/manage/residence/:residenceId/info',
    component: info,
    meta: {
      title: 'ข้อมูลหอพัก',
    },
  },
  {
    name: 'create-payment',
    path: '/manage/residence/:residenceId/payment/create',
    component: createPayment,
    meta: {
      title: 'เพิ่มช่องทางการชำระเงิน',
    },
  },
  {
    name: 'update-payment',
    path: '/manage/residence/:residenceId/payment/update/:paymentId',
    component: updatePayment,
    meta: {
      title: 'แก้ไขช่องทางการชำระเงิน',
    },
  },
  {
    name: 'bill-system',
    path: '/manage/residence/:residenceId/bill-system',
    component: bill,
    meta: {
      title: 'Bill System',
    },
  },
  {
    name: 'meter-record',
    path: '/manage/residence/:residenceId/meter-record',
    component: meterRecord,
    meta: {
      title: 'ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ',
    },
  },
  {
    name: 'create-meter-record',
    path: '/manage/residence/:residenceId/meter-record/create',
    component: createMeterRecord,
    meta: {
      title: 'สร้างระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ',
    },
  },
  {
    path: '/upload',
    component: () => import('./pages/upload.vue'),
    name: 'upload',
    meta: {
      title: 'Upload',
    },
  },
  {
    path: '/:path(.*)',
    component: NotFound,
    name: 'not-found',
    meta: {
      title: 'ไม่พบหน้านี้',
    },
  },
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
  try {
    const userStore = useUserStore();
    await userStore.fetchUserData();

    console.log('User logged in:', userStore.isLoggedIn);

    const isPublicRoute = publicRoutes.includes(to.name);
    const isRestrictedForLoggedIn = restrictedRoutesForLoggedInUsers.includes(
      to.name
    );

    if (!isPublicRoute) {
      if (!userStore.isLoggedIn) return next({ name: 'signin' });
    } else if (isRestrictedForLoggedIn && userStore.isLoggedIn) {
      return next({ name: 'manage' });
    }

    return next();
  } catch (error) {
    console.error('Error in navigation guard:', error);
  }
});

export default router;
