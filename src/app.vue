<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
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
  const excludedRoutes = ['signup', 'signin'];
  return !excludedRoutes.includes(route.name);
});

const shouldShowNavbar = computed(() => {
  const excludedRoutes = ['signup', 'signin'];
  return !excludedRoutes.includes(route.name);
});

onMounted(async () => {
  await userStore.fetchMe();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <navbar :isLoggedIn="userStore.isLoggedIn" v-if="shouldShowNavbar" />
    <router-view />
    <Footer v-if="shouldShowFooter" />
  </div>
</template>

<style scoped></style>
