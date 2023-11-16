<script setup>
import { onMounted } from 'vue';
import { currentTheme, initTheme, switchTheme } from '@/composables/theme.js';
import Button from '@/components/button.vue';
import SigninPopup from '@/components/button.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <button class="btn">Button</button>
  <Button text="Button" />
  <Button text="Button" btnType="secondary" />
  <SigninPopup />
</template>

<style></style>
