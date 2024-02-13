<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box shadow-lg w-full">
    <div
      :id="`item-${index}`"
      class="carousel-item w-full"
      v-for="(image, index) in images"
      :key="index"
    >
      <img :src="image" class="w-full" />
    </div>
  </div>
  <!-- <div class="flex justify-center w-full py-2 gap-2">
    <a
      :href="`#item-${index}`"
      class="btn btn-xs"
      v-for="(_, index) in images"
      :key="index"
      >{{ index + 1 }}</a
    >
  </div> -->
</template>

<style scoped></style>
