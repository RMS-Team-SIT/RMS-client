<script setup>
import { defineProps } from 'vue';
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
});
</script>
<template>
  <button
    class="inline-flex items-center space-x-1 rounded-md bg-coral-red-hover py-3 px-4 font-medium text-indigo-50 shadow-xl transition duration-300 hover:bg-coral-red hover:shadow-md"
  >
    <span v-if="icon" class="w-5 h-5">
      <component :is="icon" :class="iconClass" />
    </span>
    <span>{{ text }}</span>
  </button>
</template>
