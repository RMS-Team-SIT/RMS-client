<script setup>
import { computed } from '@vue/runtime-core';

const props = defineProps({
  icon: {
    type: Object,
    default: null,
  },
  iconClass: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  btnType: {
    type: String,
    default: 'primary',
  },
});

const classes = computed(() => {
  console.log(props.btnType);
  let classes = [];
  switch (props.btnType) {
    case 'primary':
      classes.push('bg-dark-blue');
      classes.push('hover:bg-blue-700');
      break;
    case 'secondary':
      classes.push('bg-light-red');
      classes.push('hover:bg-red-700');
      break;
    default:
      break;
  }
  return classes;
});
</script>

<template>
  <button class="btn text-white rounded-md" :class="classes">
    <span v-if="icon" class="w-5 h-5">
      <component :is="icon" :class="iconClass" />
    </span>
    <span>{{ text }}</span>
  </button>
</template>

<style scoped></style>
