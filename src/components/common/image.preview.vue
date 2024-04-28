<script setup>
import { onMounted, ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/button.vue';
import { isImage } from '@/utils/file';

const isModalOpen = ref(false);
const selectedImage = ref(null);
const imagePreviews = ref([]);

const props = defineProps({
  imageFiles: {
    type: Array,
    default: () => [],
  },
  imageUrls: {
    type: Array,
    default: () => [],
  },
  previewFrom: {
    type: String,
    default: 'files',
  },
});

const previewImages = (files) => {
  Array.from(files).forEach((file) => {
    if (isImage(file)) {
      // preview image by reading the file and convert it to base64
      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: `${file.name} is not a valid image file.`,
        type: 'error',
      });
      console.warn(`${file.name} is not a valid image file.`);
    }
  });
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
  if (props.previewFrom === 'files') {
    previewImages(props.imageFiles);
  } else {
    imagePreviews.value = props.imageUrls;
  }
});
</script>

<template>
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
    * คลิกที่รูปภาพเพื่อดูขนาดใหญ่
  </p>

  <p v-else>ไม่มีรูปภาพในระบบ</p>

  <!-- modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    style="margin-top: 0px;"
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
</template>
