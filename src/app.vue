<script setup>
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import Footer from './components/common/footer.vue';
import { projectName } from './constants';
import { useUserStore } from './stores/user.store';
import Loading from './components/common/loading.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const isLoading = ref(true);

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
  ];
  return !excludedRoutes.includes(route.name);
});

onMounted(async () => {
  await userStore.fetchMe();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-else>
    <navbar :isLoggedIn="userStore.isLoggedIn" v-if="shouldShowNavbar" />
    <router-view />
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
