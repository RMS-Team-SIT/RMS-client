<script setup>
import { onMounted } from 'vue';
import { currentTheme, initTheme, switchTheme } from '@/composables/theme.js';
import Button from '@/components/button.vue';
import SigninPopup from '@/components/button.vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/navbar.vue';
import { themeChange } from 'theme-change';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  // initTheme();
  themeChange('light', 'dark');
});
</script>

<template>
  <Navbar />
</template>

<style></style>
