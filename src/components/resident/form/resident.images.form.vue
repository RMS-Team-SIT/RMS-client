<script setup>
import ImageUploadForm from '@/components/form/image.form.vue';
import { onMounted, reactive, ref, watch } from 'vue';

const emit = defineEmits(['getData']);

const isLoading = ref(false);

const props = defineProps({
  residentData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const residentImages = reactive({
  images: [],
});

const emitData = () => {
  emit('getData', residentImages);
  console.log('Emitted residentContact', residentImages);
};


const getImages = (images) => {
  residentImages.images = images;
};

const setDataFromProps = () => {
  for (const key in props.residentData) {
    if (key in residentImages) residentImages[key] = props.residentData[key];
  }
  isLoading.value = false;
};

onMounted(() => {
  setDataFromProps();
});

watch(residentImages, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Resident Images</h1>
    <p class="text-xs">Please upload your resident images.</p>
    <ImageUploadForm v-if="!isLoading" @getImages="getImages" :images="residentImages.images" />
  </div>
</template>

<style scoped></style>
