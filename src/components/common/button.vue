<script setup>
import { computed } from 'vue';

const props = defineProps({
  btnType: {
    type: String,
    default: 'primary',
  },
});

const classes = computed(() => {
  let buttonClasses = ['text-xs', 'md:text-md', 'lg:text-sm'];
  switch (props.btnType) {
    case 'primary':
      buttonClasses.push(
        'bg-dark-blue-200',
        'hover:bg-dark-blue-100',
        'rounded-md'
      );
      break;
    case 'secondary':
      buttonClasses.push('bg-light-red', 'hover:bg-red-700', 'rounded-md');
      break;
    case 'primary-pill':
      buttonClasses.push(
        'bg-dark-blue-200',
        'hover:bg-dark-blue-100',
        'rounded-full'
      );
      break;
    case 'secondary-pill':
      buttonClasses.push('bg-light-red', 'hover:bg-red-700', 'rounded-full');
      break;
    default:
      break;
  }
  return buttonClasses;
});
</script>

<template>
  <button class="btn text-white" :class="classes">
    <slot></slot>
  </button>
</template>

<style scoped></style>
