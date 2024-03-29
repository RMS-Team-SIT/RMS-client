<script setup>
import { computed, inject, onMounted, onUpdated, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import Footer from './components/common/footer.vue';
import { projectName } from './utils/constants';
import { useUserStore } from './stores/user.store';
import Loading from './components/common/loading.vue';
import { useI18n } from 'vue-i18n';
import { languages } from './i18n';
import CookieConsent from './components/common/cookie-consent.vue';
import { useServerStore } from './stores/server.store';
import LoggedInLandlord from './layout/loggedInLandlord.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const serverStore = useServerStore();
const isLoading = ref(true);
const { locale } = useI18n();
const isThai = computed(() => locale.value === 'th');

watchEffect(
  () => (document.title = `${projectName} | ${route.meta.title || ''}`)
);

const shouldShowFooter = computed(() => {
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
    'home'
  ];
  return !excludedRoutes.includes(route.name);
});

const shouldShowNavbar = computed(() => {
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
  ];
  return !excludedRoutes.includes(route.name);
});

const shouldShowSidebar = computed(() => {
  const excludedRoutes = ['pending-residence','print-bill-room'];
  return userStore.isLoggedIn && route.params?.residenceId && !excludedRoutes.includes(route.name); ;
});

const setLang = () => {
  const lang = localStorage.getItem('lang') || 'en';
  const supportedLang = languages.find((l) => l.value === lang);

  if (!supportedLang) {
    console.log(`${lang} is not supported, setting to default lang: en`);
    localStorage.setItem('lang', 'en');
    locale.value = 'en';
  } else {
    locale.value = lang;
  }
};

const isShowCookieConsent = ref(
  localStorage.getItem('cookie-consent') !== 'accepted'
);

const acceptCookieConsent = () => {
  localStorage.setItem('cookie-consent', 'accepted');
  isShowCookieConsent.value = false;
};

onMounted(async () => {
  await serverStore.fetch();
  // wait 500ms to show loading
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
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
