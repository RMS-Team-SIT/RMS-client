<script setup>
import ImageUploadForm from '@/components/form/image.upload.form.vue';
import { onMounted, reactive, ref } from 'vue';

const props = defineProps({
  residentData: {
    type: Object,
    default: () => ({}),
  },
});

const residentImages = reactive({
  images: [],
});

const getImage = (images) => {
  residentImages.images = images;
};

const setDataFromProps = () => {
  for (const key in props.residentData) {
    if (key in residentInfo) residentInfo[key] = props.residentData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Resident Images</h1>
    <p class="text-xs">Please upload your resident images.</p>
    <ImageUploadForm @getImage="getImage" />
  </div>
</template>

<style scoped></style>
