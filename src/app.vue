<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import Footer from './components/common/footer.vue';
import { projectName } from './utils/constants';
import { useUserStore } from './stores/user.store';
import Loading from './components/common/loading.vue';
import CookieConsent from './components/common/cookie-consent.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const isLoading = ref(true);

const excludedRoutes = [
  'signup',
  'signin',
  'pdf-preview',
  'forget-password',
  'reset-password',
  'verify-email',
  'not-found',
  'unavailable',
  'renter-signin',
  'print-bill-room',
  'pending-residence'
];

const shouldShowFooter = computed(() => !excludedRoutes.includes(route.name));
const shouldShowNavbar = computed(() => !excludedRoutes.includes(route.name));
const shouldShowSidebar = computed(() => {
  return userStore.isLoggedIn && route.params?.residenceId && !excludedRoutes.includes(route.name);
});

const isShowCookieConsent = ref(localStorage.getItem('cookie-consent') !== 'accepted');

const acceptCookieConsent = () => {
  localStorage.setItem('cookie-consent', 'accepted');
  isShowCookieConsent.value = false;
};

onMounted(() => {
  router.afterEach(() => {
    isLoading.value = false;
  });
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div class="font-noto" v-show="!isLoading">
    <navbar
      v-if="shouldShowNavbar"
      :isLoggedIn="userStore.isLoggedIn"
      :user="userStore.getUser"
      :isHome="route.name === 'home'"
    />
    <LoggedInLandlord v-if="shouldShowSidebar">
      <router-view class="min-h-screen w-full" />
    </LoggedInLandlord>
    <router-view v-else class="min-h-screen w-full" />
    <notifications group="tr" position="top right" class="text-md" />
    <Footer v-if="shouldShowFooter" />
    <CookieConsent v-if="isShowCookieConsent" @accept="acceptCookieConsent" />
  </div>
</template>

<style scoped></style>
