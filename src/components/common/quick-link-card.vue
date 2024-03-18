<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const { routerPath, title, text, icon, icons } = defineProps({
  routerPath: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: false,
  },
  icons: {
    type: Array,
    required: false,
  },
});
</script>

<template>
  <div
    @click="router.push(routerPath)"
    class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer border border-gray-200"
  >
    <div class="flex flex-between items-center">
      <div class="flex-1">
        <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
        <p>{{ text }}</p>
      </div>
      <component :is="icon" class="h-8 w-8 inline-block" />
      <div v-for="icon in icons" :key="icon" class="flex gap-2">
        <component :is="icon" class="h-8 w-8 inline-block" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
