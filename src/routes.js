import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user.store';
import { useServerStore } from './stores/server.store';
import { projectFullName, projectName } from './utils/constants';

const index = () => import('@/pages/index.vue');
const NotFound = () => import('@/pages/not-found.vue');
const unavailable = () => import('@/pages/unavailable.vue');
const signup = () => import('@/pages/signup.vue');
const signin = () => import('@/pages/signin.vue');
const renterSignin = () => import('@/pages/renter-signin.vue');
const signout = () => import('@/pages/signout.vue');
const manage = () => import('@/pages/residence/manage.vue');

const PdfPreview = () => import('./pages/pdf-preview.vue');

const profile = () => import('./pages/user/profile.vue');
const verifyEmail = () => import('./pages/verify-email.vue');
const forgetPassword = () => import('./pages/forget-password.vue');
const resetPassword = () => import('./pages/reset-password.vue');

// KYC
const kycVerifyEmail = () => import('./pages/user/kyc/verify-email.vue');
const kycPolicy = () => import('./pages/user/kyc/policy.vue');
const kycIdcard = () => import('./pages/user/kyc/id-card.vue');
const kycApprovalStatus = () => import('./pages/user/kyc/approval-status.vue');

const dashboard = () => import('./pages/residence/dashboard.vue');
const info = () => import('@/pages/residence/info.vue');
const createResidenceNew = () => import('@/pages/residence/create.vue');
const updateResidenceInfo = () => import('./pages/residence/update.info.vue');
const pendingResidence = () => import('./pages/residence/pending.vue');

const renter = () => import('./pages/residence/renter/renter.vue');
const createRenter = () => import('./pages/residence/renter/create.vue');
const updateRenter = () => import('./pages/residence/renter/update.vue');
const viewRenter = () => import('./pages/residence/renter/view.vue');

// room
const room = () => import('./pages/residence/room/room.vue');
const viewRoom = () => import('./pages/residence/room/view.vue');
const createRoom = () => import('./pages/residence/room/create.vue');
const createManyRoom = () => import('./pages/residence/room/create-many.vue');
const updateRoom = () => import('./pages/residence/room/update.vue');

// room type
const roomType = () => import('./pages/residence/room-type/room-type.vue');
const createRoomType = () => import('./pages/residence/room-type/create.vue');
const viewRoomType = () => import('./pages/residence/room-type/view.vue');

// rent
const rent = () => import('./pages/residence/rent/rent.vue');

// Fee and Electric
const fee = () => import('./pages/residence/fee/fee.vue');
const createFee = () => import('./pages/residence/fee/create-fee.vue');
const updateUtility = () => import('./pages/residence/fee/update-utility.vue');

const payment = () => import('./pages/residence/payment/payment.vue');
const createPayment = () => import('./pages/residence/payment/create.vue');
const updatePayment = () => import('./pages/residence/payment/update.vue');

const bill = () => import('./pages/residence/bill/index.vue');
const createBill = () => import('./pages/residence/bill/create.vue');
const updateBill = () => import('./pages/residence/bill/update.vue');

const meterRecord = () => import('./pages/residence/meter-record/index.vue');
const createMeterRecord = () =>
  import('./pages/residence/meter-record/create.vue');
const updateMeterRecord = () =>
  import('./pages/residence/meter-record/update.vue');
const viewMeterRecord = () => import('./pages/residence/meter-record/view.vue');

// Admin
const adminDashboard = () => import('./pages/admin/dashboard.vue');

// Renter
const renterDashboard = () => import('./pages/renter/dashboard.vue');
const renterBills = () => import('./pages/renter/renter-bills.vue');
const renterSettings = () => import('./pages/renter/settings.vue');
const renterInfo = () => import('./pages/renter/info.vue');
const renterRoomInfo = () => import('./pages/renter/room-info.vue');

// Printable
const printBillRoom = () => import('./pages/printable/bill-room.vue');

// Routes
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
    path: '/auth/signin',
    component: signin,
    meta: {
      title: 'เข้าสู่ระบบ',
    },
  },
  {
    name: 'renter-signin',
    path: '/auth/residence/:residenceId/signin',
    component: renterSignin,
    meta: {
      title: 'เข้าสู่ระบบผู้เช่า',
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
  // {
  //   name: 'create-residence',
  //   path: '/create/residence',
  //   component: createResidence,
  //   meta: {
  //     title: 'สร้างหอพัก',
  //   },
  // },
  {
    name: 'create-residence',
    path: '/create/residence',
    component: createResidenceNew,
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
    name: 'view-renter',
    path: '/manage/residence/:residenceId/renter/:renterId',
    component: viewRenter,
    meta: {
      title: 'ดูข้อมูลผู้เช่า',
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
      title: 'สร้างห้องพักในระบบ',
    },
  },
  {
    name: 'create-room-type',
    path: '/manage/residence/:residenceId/room-type/create',
    component: createRoomType,
    meta: {
      title: 'สร้างประเภทห้องพักในระบบ',
    },
  },
  {
    name: 'view-room',
    path: '/manage/residence/:residenceId/room/:roomId',
    component: viewRoom,
    meta: {
      title: 'ดูข้อมูลห้องพัก',
    },
  },

  {
    name: 'view-room-type',
    path: '/manage/residence/:residenceId/room-type/:roomTypeId',
    component: viewRoomType,
    meta: {
      title: 'ดูข้อมูลประเภทห้องพัก',
    },
  },
  {
    name: 'create-many-room',
    path: '/manage/residence/:residenceId/room/create-many',
    component: createManyRoom,
    meta: {
      title: 'สร้างห้องพักในระบบ',
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
    name: 'pending-residence',
    path: '/manage/residence/pending/:residenceId',
    component: pendingResidence,
    meta: {
      title: 'ข้อมูลหอพักที่รอการอนุมัติ',
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
    name: 'room-type',
    path: '/manage/residence/:residenceId/room-type',
    component: roomType,
    meta: {
      title: 'จัดการประเภทห้องพัก',
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
    name: 'bill',
    path: '/manage/residence/:residenceId/bill',
    component: bill,
    meta: {
      title: 'ระบบจัดการบิล',
    },
  },
  {
    name: 'create-bill',
    path: '/manage/residence/:residenceId/bill/create',
    component: createBill,
    meta: {
      title: 'สร้างบิล',
    },
  },
  {
    name: 'update-bill',
    path: '/manage/residence/:residenceId/bill/update/:billId',
    component: updateBill,
    meta: {
      title: 'แก้ไขบิล',
    },
  },
  {
    name: 'meter-record',
    path: '/manage/residence/:residenceId/meter-record',
    component: meterRecord,
    meta: {
      title: 'ระบบบันทึกค่าน้ำ ค่าไฟ ',
    },
  },
  {
    name: 'create-meter-record',
    path: '/manage/residence/:residenceId/meter-record/create',
    component: createMeterRecord,
    meta: {
      title: 'สร้างระบบบันทึกค่าน้ำ ค่าไฟ ',
    },
  },
  {
    name: 'update-meter-record',
    path: '/manage/residence/:residenceId/meter-record/update/:meterRecordId',
    component: updateMeterRecord,
    meta: {
      title: 'แก้ไขบันทึกค่าน้ำ ค่าไฟ',
    },
  },
  {
    name: 'view-meter-record',
    path: '/manage/residence/:residenceId/meter-record/:meterRecordId',
    component: viewMeterRecord,
    meta: {
      title: 'ดูข้อมูลบันทึกค่าน้ำ ค่าไฟ',
    },
  },
  {
    name: 'admin-dashboard',
    path: '/admin/dashboard',
    component: adminDashboard,
    meta: {
      title: 'แดชบอร์ดผู้ดูแลระบบ',
    },
  },
  {
    name: 'kyc-verify-email',
    path: '/kyc/step/verify-email',
    component: kycVerifyEmail,
    meta: {
      title: 'ยืนยันอีเมล',
    },
  },
  {
    name: 'kyc-policy',
    path: '/kyc/step/policy',
    component: kycPolicy,
    meta: {
      title: 'เงื่อนไขการใช้งาน',
    },
  },
  {
    name: 'kyc-id-card',
    path: '/kyc/step/idcard',
    component: kycIdcard,
    meta: {
      title: 'ยืนยันตัวตน',
    },
  },
  {
    name: 'kyc-approval-status',
    path: '/kyc/step/approval-status',
    component: kycApprovalStatus,
    meta: {
      title: 'รอการอนุมัติ',
    },
  },
  {
    name: 'fee',
    path: '/manage/residence/:residenceId/fee',
    component: fee,
    meta: {
      title: 'จัดการค่าใช้จ่ายในหอพัก',
    },
  },
  {
    name: 'create-fee',
    path: '/manage/residence/:residenceId/fee/create',
    component: createFee,
    meta: {
      title: 'เพิ่มค่าใช้จ่ายในหอพัก',
    },
  },
  {
    name: 'update-utility',
    path: '/manage/residence/:residenceId/fee/update-utility',
    component: updateUtility,
    meta: {
      title: 'จัดการค่าใช้จ่ายในหอพัก',
    },
  },
  {
    name: 'rent',
    path: '/manage/residence/:residenceId/rent',
    component: rent,
    meta: {
      title: 'การย้ายเข้า ย้ายออก',
    },
  },
  {
    path: '/unavailable',
    component: unavailable,
    name: 'unavailable',
    meta: {
      title: 'เซิฟเวอร์มีปัญหา โปรดลองใหม่อีกครั้ง',
    },
  },
  {
    name: 'print-bill-room',
    path: '/manage/residence/:residenceId/print/bill/:billId/bill-room/:billRoomId',
    component: printBillRoom,
    meta: {
      title: 'พิมพ์บิลห้องพัก',
    },
  },
  {
    name: 'renter-dashboard',
    path: '/renter/dashboard',
    component: renterDashboard,
    meta: {
      title: 'แดชบอร์ดผู้เช่า',
    },
  },
  {
    name: 'renter-bills',
    path: '/renter/bills',
    component: renterBills,
    meta: {
      title: 'บิลผู้เช่า',
    },
  },
  {
    name: 'renter-settings',
    path: '/renter/settings',
    component: renterSettings,
    meta: {
      title: 'ตั้งค่าผู้เช่า',
    },
  },
  {
    name: 'renter-info',
    path: '/renter/info',
    component: renterInfo,
    meta: {
      title: 'ข้อมูลผู้เช่า',
    },
  },
  {
    name: 'renter-room-info',
    path: '/renter/room/info',
    component: renterRoomInfo,
    meta: {
      title: 'ข้อมูลห้องพักผู้เช่า',
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

const publicRoutes = [
  'home',
  'signup',
  'signin',
  'forget-password',
  'reset-password',
  'verify-email',
  'renter-signin',
  'unavailable',
];

const restrictedRoutesForLoggedInUsers = [
  'home',
  'signup',
  'signin',
  'forget-password',
  'reset-password',
  'renter-signin',
];

export const adminRoutes = ['admin-dashboard'];

export const renterRoutes = [
  'renter-dashboard',
  'renter-signin',
  'renter-bills',
  'renter-settings',
  'renter-info',
  'renter-room-info',
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
    // set page title
    document.title = `${projectName} | ` + to.meta.title || 'หน้าแรก';

    const serverStore = useServerStore();
    await serverStore.fetch();
    const status = serverStore.getStatus;

    if (!status.up) {
      console.info('API Status: Down');
      if (to.name !== 'unavailable')
        return next({
          name: 'unavailable',
          query: { returnPath: encodeURIComponent(to.fullPath) },
        });
    } else {
      console.info('API Status: OK');
    }

    if (to.name === 'unavailable') {
      if (status.up)
        return next({ path: decodeURIComponent(to.query.returnPath) });
      return next();
    }

    const isPublicRoute = publicRoutes.includes(to.name);
    const isRestrictedForLoggedIn = restrictedRoutesForLoggedInUsers.includes(
      to.name
    );
    const isAdminRoute = adminRoutes.includes(to.name);
    const isRenterRoute = renterRoutes.includes(to.name);

    const userStore = useUserStore();
    await userStore.fetchUserData();
    const user = userStore.getUser;

    console.log({
      isPublicRoute,
      isRestrictedForLoggedIn,
      isAdminRoute,
      isRenterRoute,
      user,
    });

    // Admin
    // Admin can access all routes
    if (user && user.role === 'admin') {
      if (isRestrictedForLoggedIn) {
        return next({ name: 'admin-dashboard' });
      }
      return next();
    }

    // User
    // User can access all routes except admin routes, renter routes  and restricted routes for logged in users
    else if (user && user.role === 'user') {
      if (isAdminRoute) {
        return next({ name: 'manage' });
      }

      if (isRestrictedForLoggedIn) {
        return next({ name: 'manage' });
      }

      if (isRenterRoute) {
        return next({ name: 'manage' });
      }

      // Non kyc user can only access kyc route
      if (!user.isEmailVerified && to.name !== 'kyc-verify-email') {
        if (to.name === 'signout' || to.name === 'verify-email') return next();
        return next({ name: 'kyc-verify-email' });
      } else if (
        user.isEmailVerified &&
        !user.isAcceptedPolicy &&
        to.name !== 'kyc-policy'
      ) {
        if (to.name === 'signout') return next();
        return next({ name: 'kyc-policy' });
      } else if (
        user.isEmailVerified &&
        user.isAcceptedPolicy &&
        !user.idcardNumber &&
        to.name !== 'kyc-id-card'
      ) {
        if (to.name === 'signout') return next();
        return next({ name: 'kyc-id-card' });
      } else if (
        user.isEmailVerified &&
        user.isAcceptedPolicy &&
        user.idcardNumber &&
        !user.isApprovedKYC &&
        to.name !== 'kyc-approval-status'
      ) {
        if (to.name === 'signout') return next();
        return next({ name: 'kyc-approval-status' });
      } else if (
        user.isEmailVerified &&
        user.isAcceptedPolicy &&
        user.idcardNumber &&
        user.isApprovedKYC &&
        (to.name === 'kyc-verify-email' ||
          to.name === 'kyc-policy' ||
          to.name === 'kyc-id-card' ||
          to.name === 'kyc-approval-status')
      ) {
        console.log('User is verified');
        return next({ name: 'manage' });
      }

      return next();
    }

    // Renter
    // Renter can access only renter routes
    else if (user && user.role === 'renter') {
      if (isAdminRoute) {
        return next({ name: 'renter-dashboard' });
      }

      if (isRestrictedForLoggedIn) {
        return next({ name: 'renter-dashboard' });
      }

      // Renter can access only renter routes including
      if (
        isRenterRoute ||
        to.name === 'signout' ||
        to.name === 'print-bill-room' ||
        to.name === 'unavailable' ||
        to.name === 'pdf-preview'
      ) {
        return next();
      }

      return next({ name: 'renter-dashboard' });
    }

    // Non-User
    // Non-User can access only public routes
    else {
      if (!isPublicRoute) {
        return next({ name: 'signin' });
      }
      return next();
    }
  } catch (error) {
    console.error('Error in navigation guard:', error);
    return next({
      name: 'unavailable',
      query: { returnPath: encodeURIComponent(to.fullPath) },
    });
  }
});

export default router;
