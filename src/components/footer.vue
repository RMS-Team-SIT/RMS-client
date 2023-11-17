<script setup>
import { projectFullName } from '@/constaint';

const thisYear = new Date().getFullYear();
</script>

<template>
  <!-- Footer -->
  <footer class="bg-dark-blue-200 text-white p-4 mt-8">
    <div class="container mx-auto text-center">
      <p class="text-sm">
        &copy; {{thisYear}} {{projectFullName}}. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
