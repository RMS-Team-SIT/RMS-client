<script setup>
import { computed } from 'vue';

const props = defineProps({
  btnType: {
    type: String,
    default: 'primary',
  },
});

const classes = computed(() => {
  let buttonClasses = [];
  switch (props.btnType) {
    case 'primary':
      buttonClasses.push('bg-dark-blue-200', 'hover:bg-dark-blue-100');
      break;
    case 'secondary':
      buttonClasses.push('bg-light-red', 'hover:bg-red-700');
      break;
    default:
      break;
  }
  return buttonClasses;
});
</script>

<template>
  <button class="btn text-white rounded-md" :class="classes">
    <slot></slot>
  </button>
</template>

<style scoped></style>
