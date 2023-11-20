<script setup>
import { ref } from 'vue';
import { isImage } from '@/utils';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Button from './button.vue';

const isModalOpen = ref(false);
const selectedImage = ref(null);
const imagePreviews = ref([]);
const fileInputTemp = ref(null);

const emits = defineEmits(['getImage']);

const handleFileChange = () => {
  const fileInput = fileInputTemp.value;

  const files = fileInput.files;

  if (files.length > 0) {
    previewImages(files);
  }
};

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

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1);
};

const openModal = (index) => {
  selectedImage.value = imagePreviews.value[index];
  isModalOpen.value = true;
};

const closeModal = () => {
  selectedImage.value = null;
  isModalOpen.value = false;
};

const clearImages = () => {
  imagePreviews.value = [];
};

const getImage = () => {
  emits('getImage', imagePreviews.value);
  console.log('GetImage Emit called', imagePreviews.value);
  return imagePreviews.value;
};
</script>

<template>
  <div>
    <!-- preview -->
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
        <button
          @click="removeImage(index)"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <p
      class="text-sm flex gap-2 text-gray-500 mt-2"
      v-if="imagePreviews.length > 0"
    >
      * Click
      <XMarkIcon class="w-4 h-4 bg-red-500 rounded-full p-1 text-white" />
      to remove image
    </p>
    <p class="text-sm flex gap-2 text-gray-500" v-if="imagePreviews.length > 0">
      * Click the image to view full size
    </p>

    <!-- input -->
    <input
      type="file"
      id="imageUpload"
      ref="fileInputTemp"
      @change="handleFileChange"
      multiple
      class="file-input file-input-bordered w-full max-w-xs file-input-ghost"
    />
    <Button btnType="secondary" @click="clearImages" class="mt-5 rounded-full"
      >Clear Image</Button
    >

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
          class="w-full h-full"
        />
      </div>
    </div>
  </div>
</template>