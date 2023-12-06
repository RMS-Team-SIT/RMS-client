<script setup>
import { computed } from 'vue';

const props = defineProps({
  btnType: {
    type: String,
    default: 'primary',
    validator: (value) =>
      [
        'primary',
        'secondary',
        'primary-pill',
        'secondary-pill',
        'ghost-pill',
      ].includes(value),
  },
});

const classes = computed(() => {
  const buttonClasses = [
    'btn',
    'text-xs',
    'md:text-md',
    'lg:text-sm',
  ];

  const typeToClasses = {
    primary: [
      'bg-dark-blue-200',
      'hover:bg-dark-blue-100',
      'rounded-md',
      'text-white',
    ],
    secondary: ['bg-light-red', 'hover:bg-red-700', 'rounded-md', 'text-white'],
    'primary-pill': [
      'bg-dark-blue-200',
      'hover:bg-dark-blue-100',
      'rounded-full',
      'text-white',
    ],
    'secondary-pill': [
      'bg-light-red',
      'hover:bg-red-700',
      'rounded-full',
      'text-white',
    ],
    'ghost-pill': ['btn-ghost', 'rounded-full'],
  };

  return [...buttonClasses, ...(typeToClasses[props.btnType] || [])];
});
</script>

<template>
  <button :class="classes">
    <slot></slot>
  </button>
</template>

<style scoped></style>
