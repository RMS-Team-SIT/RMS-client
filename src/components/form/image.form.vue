<script setup>
import { onMounted, ref, watch } from 'vue';
import { isImage } from '@/utils';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/button.vue';
import { useNotification } from '@kyvg/vue3-notification';

const { notify } = useNotification();
const props = defineProps({
  imageFiles: {
    type: Array,
    default: () => [],
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const isModalOpen = ref(false);
const selectedImage = ref(null);
const fileInputTemp = ref(null);

// Note imagePreviews and imageFiles are the same file
// but imagePreviews is used to display the preview and imageFiles
// is used to send to the server
const imagePreviews = ref([]);
const imageFiles = ref([]);

const emits = defineEmits(['getImageFiles']);

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
      // preview image by reading the file and convert it to base64
      const reader = new FileReader();

      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };

      reader.readAsDataURL(file);

      // push the file to imageFiles
      imageFiles.value.push(file);
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

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
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
  imageFiles.value = [];
};

const emitData = () => {
  emits('getImageFiles', { imageFiles: imageFiles.value });
};

watch(
  imageFiles.value,
  () => {
    emitData();
  },
  { deep: true }
);

onMounted(() => {
  previewImages(props.imageFiles);
});
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
          v-if="!viewOnly"
          @click="removeImage(index)"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <p
      class="text-sm flex gap-2 text-gray-500 mt-2"
      v-if="imagePreviews.length > 0 && !viewOnly"
    >
      * กดที่ไอคอน
      <XMarkIcon class="w-4 h-4 bg-red-500 rounded-full p-1 text-white" />
      เพื่อลบรูปภาพ
    </p>
    <p class="text-sm flex gap-2 text-gray-500" v-if="imagePreviews.length > 0">
      * กดที่รูปภาพเพื่อดูรูปขนาดใหญ่
    </p>

    <!-- input -->
    <input
      v-if="!viewOnly"
      type="file"
      id="imageUpload"
      ref="fileInputTemp"
      @change="handleFileChange"
      multiple
      class="file-input-sm file-input file-input-bordered bg-white  w-full max-w-xs file-input-ghost"
    />
    <Button
      v-if="!viewOnly"
      btnType="secondary-pill"
      @click="clearImages"
      class="m-5"
      >ลบรูปภาพทั้งหมด</Button
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
          class="w-full h-full max-h-96"
        />
      </div>
    </div>
  </div>
</template>
