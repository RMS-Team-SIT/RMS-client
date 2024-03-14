<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  to: {
    type: Object,
    default: () => ({}),
  }
});
</script>

<template>
  <p
    class="flex gap-2 items-center mt-5 hover:underline hover:cursor-pointer"
    @click="router.push({ name: to.name, params: to.params })"
  >
    <ArrowLeftIcon class="w-4 h-4" /> ย้อนกลับ
  </p>
</template>

<style scoped></style>
