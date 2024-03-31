<script setup>
import ResidenceSidebar from '@/components/sidebar/residence-sidebar.vue';
</script>

<template>
  <div class="flex min-h-screen w-full">
    <!-- Sidebar -->
    <ResidenceSidebar />

    <slot class="w-full min-w-full"></slot>
  </div>
</template>

<style scoped></style>
