<script setup>
import { onMounted } from 'vue';
import { currentTheme, initTheme, switchTheme } from '@/composables/theme.js';
import Button from '@/components/button.vue';
import { ArrowRightIcon } from 'heroicons/';

onMounted(() => {
  initTheme();
});
</script>

<template>
  <Button
    :icon="ArrowRightIcon"
    text="go"
    @click="switchTheme"
  />
</template>

<style></style>
