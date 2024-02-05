<script setup>
const props = defineProps({
  bank: {
    type: String,
  },
  size: {
    type: String,
    default: 'xl',
  },
});
</script>

<template>
  <i :class="['bank', size, `bank-${bank}`]" />
</template>

<style scoped></style>
