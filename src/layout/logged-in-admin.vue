<script setup>
import AdminSidebar from '@/components/sidebar/admin-sidebar.vue';
</script>

<template>
  <div class="flex min-h-screen w-full">
    <!-- Sidebar -->
    <AdminSidebar />

    <slot class="w-full min-w-full"></slot>
  </div>
</template>

<style scoped></style>
