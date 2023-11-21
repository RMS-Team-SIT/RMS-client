<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import { projectName } from './constants';
import { useUserStore } from './stores/user.store';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

watchEffect(
  () => (document.title = `${projectName} | ${route.meta.title || ''}`)
);

onMounted(async () => {
  await userStore.fetchMe();
});
</script>

<template>
  <div>
    
  </div>
  <navbar :isLoggedIn="userStore.isLoggedIn" />
  <router-view />
  <Footer />
</template>

<style scoped></style>
