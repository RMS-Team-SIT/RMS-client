<script setup>
import Sidebar from '@/components/common/sidebar.vue';
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <slot class="w-full"></slot>
  </div>
</template>

<style scoped></style>
