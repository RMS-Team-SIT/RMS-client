<script setup>
import RenterSidebar from '@/components/sidebar/renter-sidebar.vue';
</script>

<template>
  <div class="flex min-h-screen w-full">
    <!-- Sidebar -->
    <RenterSidebar />

    <slot class="w-full min-w-full"></slot>
  </div>
</template>

<style scoped></style>
