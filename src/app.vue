<script setup>
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import Footer from './components/common/footer.vue';
import { projectName } from './constants';
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
  setLang();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <!-- <div :class="{ 'font-maitree': isThai }" v-else> -->
  <div class="font-noto" v-else>
    <navbar v-if="shouldShowNavbar" :isLoggedIn="userStore.isLoggedIn" />
    <router-view class="min-h-screen" />
    <div>
      <notifications group="tc" position="top center" class="text-md" />
      <notifications group="tr" position="top right" class="text-md" />
      <notifications group="bl" position="bottom left" class="text-md" />
      <notifications group="br" position="bottom right" class="text-md" />
    </div>
    <Footer v-if="shouldShowFooter" />
  </div>
</template>

<style scoped></style>
