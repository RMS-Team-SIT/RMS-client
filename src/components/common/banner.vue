<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
    default: 'Banner',
  },
});
</script>

<template>
  <div
    class="rounded-2xl py-12 px-6 lg:px-12 text-center bg-gradient-to-tr from-pink-400 via-red-500 to-yellow-500"
  >
    <h1 class="text-3xl text-white mb-6 font-bold">
      {{ text }}
    </h1>
    <div>
      <slot />
    </div>
  </div>
</template>
