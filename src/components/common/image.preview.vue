<script setup>
import { onMounted, ref, watch } from 'vue';
import { isImage } from '@/utils';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/button.vue';

const isModalOpen = ref(false);
const selectedImage = ref(null);
const imagePreviews = ref([]);

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const previewImages = (files) => {
  Array.from(files).forEach((file) => {
    if (isImage(file)) {
      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      alert(`${file.name} is not a valid image file.`);
      console.warn(`${file.name} is not a valid image file.`);
    }
  });
  console.log(imagePreviews.value);
};

const openModal = (index) => {
  selectedImage.value = imagePreviews.value[index];
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedImage.value = null;
  isModalOpen.value = false;
};

onMounted(() => {
  imagePreviews.value = props.images;
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">
      Images
    </h1>
    <div
      v-if="imagePreviews.length > 0"
      class="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(preview, index) in imagePreviews"
        :key="index"
        class="relative"
      >
        <img
          @click="openModal(index)"
          :src="preview"
          alt="Preview"
          class="w-full h-40 object-cover rounded-md"
        />
      </div>
    </div>
    <p class="text-sm flex gap-2 text-gray-500" v-if="imagePreviews.length > 0">
      * Click the image to view full size
    </p>

    <p v-else>
      No images uploaded
    </p>

    <!-- modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div @click="closeModal" class="absolute inset-0"></div>
      <div class="relative max-w-full max-h-full">
        <button
          @click="closeModal"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
        <img
          v-if="selectedImage"
          :src="selectedImage"
          alt="Full Size"
          class="w-full h-full max-h-96"
        />
      </div>
    </div>
  </div>
</template>
