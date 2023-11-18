<script setup>
import { watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import navbar from './components/common/navbar.vue';
import { projectName } from './constants';
const router = useRouter();
const route = useRoute();

watchEffect(() => (document.title = `${projectName} | ${route.meta.title || ''}`));
</script>

<template>
  <!-- <navbar /> -->
  <router-view />
</template>

<style scoped></style>