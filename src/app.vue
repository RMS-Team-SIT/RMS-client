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

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
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
  ];
  return !excludedRoutes.includes(route.name);
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

onMounted(async () => {
  // setLang();
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="font-noto" v-else>
    <navbar
      v-if="shouldShowNavbar"
      :isLoggedIn="userStore.isLoggedIn"
      :user="userStore.getUser"
    />
    <router-view class="min-h-screen" />
    <notifications group="tr" position="top right" class="text-md" />
    <Footer v-if="shouldShowFooter" />
  </div>
</template>

<style scoped></style>
