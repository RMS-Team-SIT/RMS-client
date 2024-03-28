<script setup>
import SidebarResidence from '@/components/common/sidebar-residence.vue';
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <SidebarResidence />

    <slot class="w-full"></slot>
  </div>
</template>

<style scoped></style>
