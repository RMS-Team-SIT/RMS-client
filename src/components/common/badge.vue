<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (value) =>
      ['info', 'success', 'warning', 'error', 'ghost'].includes(value),
  },
});

const classes = computed(() => {
  const typeClasses = {
    info: ['badge-info'],
    success: ['badge-success', 'text-white'],
    warning: ['badge-warning'],
    error: ['badge-error', 'text-white'],
    ghost: ['badge-ghost'],
  };

  return ['badge', 'badge-sm', ...(typeClasses[props.type] || [])];
});
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<style scoped></style>
