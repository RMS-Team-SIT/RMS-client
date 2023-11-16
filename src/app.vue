<script setup>
import { watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/navbar.vue';
import { projectName } from './constant';
const router = useRouter();
const route = useRoute();

watchEffect(() => (document.title = `${projectName} | ${route.meta.title || ''}`));
</script>

<template>
  <!-- <navbar /> -->
  <router-view />
</template>

<style scoped></style>
