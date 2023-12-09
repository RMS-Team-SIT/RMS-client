<script setup>
import { computed } from 'vue';

const props = defineProps({
  badgeType: {
    type: String,
    default: 'success',
    validator: (value) =>
      [
        'info',
        'success',
        'warning',
        'error',
        'ghost',
        'neutral',
        'primary',
        'accent',
        'secondary',
      ].includes(value),
  },
});

const classes = computed(() => {
  const typeClasses = {
    info: ['badge-info'],
    success: ['badge-success', 'text-white'],
    warning: ['badge-warning'],
    error: ['badge-error', 'text-white'],
    ghost: ['badge-ghost'],
    neutral: ['badge-neutral'],
    primary: ['badge-primary'],
    accent: ['badge-accent'],
    secondary: ['badge-secondary'],
  };

  return ['badge', 'badge-sm', ...(typeClasses[props.badgeType] || [])];
});
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<style scoped></style>
