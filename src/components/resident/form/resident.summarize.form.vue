<script setup>
const props = defineProps({
  residentData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
 <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Review Resident Data</h1>
    <p class="text-xs">Please input resident settings.</p>
    
  </div>
</template>

<style scoped></style>
