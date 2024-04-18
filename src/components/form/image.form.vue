<script setup>
import { onMounted, ref, watch } from 'vue';
import { isImage, validateImageFile } from '@/utils/file';
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
  maxFiles: {
    type: Number,
    default: 10,
  },
  maxSizeOfEachFile: {
    type: Number,
    default: 10,
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

  if (files.length > props.maxFiles) {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: `สามารถอัปโหลดได้ไม่เกิน ${props.maxFiles} รูป`,
      type: 'error',
    });
    return;
  }
  if (files.length > 0) {
    previewImages(files);
  }
};

const previewImages = (files) => {
  Array.from(files).forEach((file) => {
    console.log('file size', file.size);
    if (validateImageFile(file, props.maxSizeOfEachFile)) {
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
        text: `${file.name} ไม่ใช่ไฟล์รูปภาพ`,
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
      เพื่อลบรูปภาพ, กดที่รูปภาพเพื่อดูรูปขนาดใหญ่
    </p>

    <!-- input -->
    <input
      v-if="!viewOnly"
      type="file"
      id="imageUpload"
      ref="fileInputTemp"
      @change="handleFileChange"
      multiple
      class="file-input-sm file-input file-input-bordered bg-white w-full max-w-xs file-input-ghost"
    />
    <p class="text-xs text-light-red">
      * สามารถอัปโหลดได้ไม่เกิน {{ props.maxFiles }} รูป แต่ละรูปขนาดไม่เกิน
      {{ props.maxSizeOfEachFile }}mb
    </p>
    <!-- <Button
      v-if="imagePreviews.length > 0 && !viewOnly"
      btnType="secondary-pill"
      @click="clearImages"
      class="mt-2"
      >ลบรูปภาพทั้งหมด</Button
    > -->

    <!-- modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
