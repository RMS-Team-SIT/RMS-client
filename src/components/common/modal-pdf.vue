<script setup>
import { ref } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import Button from '@/components/common/button.vue';

const props = defineProps({
  fileName: {
    type: String,
    required: true,
  },
});

const random = () => Math.random().toString(36).substr(2, 9);
const randomId = random();

const page = ref(1);
const scale = ref(0.5);
const { pdf, pages } = usePDF(FileService.getFile(props.fileName));
</script>

<template>
  <label :for="`pdf-preview-modal-${randomId}`">View</label>

  <input
    type="checkbox"
    :id="`pdf-preview-modal-${randomId}`"
    class="modal-toggle"
  />
  <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 modal" role="dialog">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Preview: {{ fileName }}</h3>

      <div v-if="pdf" class="flex gap-2 justify-center items-center">
        <Button @click="scale = scale > 0.25 ? scale - 0.25 : scale">
          -
        </Button>
        <span>{{ scale * 100 }}%</span>
        <Button @click="scale = scale < 2 ? scale + 0.25 : scale"> + </Button>
      </div>

      <div class="relative bg-white p-10 shadow-md rounded">
        <div v-if="pdf">
          <div v-for="page in pages" :key="page" class="flex justify-center">
            <VuePDF :pdf="pdf" :page="page" :scale="scale" />
          </div>
        </div>

        <div v-else>
          <div class="flex gap-2 justify-center items-center">
            <span class="shadow-sm p-10">No file founded.</span>
          </div>
        </div>
      </div>
    </div>
    <label class="modal-backdrop text-black" :for="`pdf-preview-modal-${randomId}`" >Close</label>
  </div>
</template>

<style scoped></style>
