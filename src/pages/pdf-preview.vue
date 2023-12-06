<script setup>
import { ref } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import Button from '@/components/common/button.vue';

const router = useRouter();
const route = useRoute();

const fileName = route.query.filename;
if (!fileName) {
  router.push({ name: 'home' });
}

const page = ref(1);
const scale = ref(0.5);
const { pdf, pages } = usePDF(FileService.getFile(fileName));
</script>

<template>
  <div class="relative bg-white p-10 shadow-md rounded">
    <div v-if="pdf">
      <h1 class="text-xl font-semibold text-dark-blue-200 text-center">
        {{ fileName }}
      </h1>
      <div class="flex gap-4 justify-center items-center">
        <Button
          btnType="secondary-pill"
          @click="page = page > 1 ? page - 1 : page"
          >Prev</Button
        >
        <span class="">{{ page }} / {{ pages }}</span>
        <Button
          btnType="secondary-pill"
          @click="page = page < pages ? page + 1 : page"
          >Next</Button
        >
      </div>
      <div class="flex gap-2 justify-center items-center">
        <Button @click="scale = scale > 0.25 ? scale - 0.25 : scale">
          -
        </Button>
        <span>{{ scale * 100 }}%</span>
        <Button @click="scale = scale < 2 ? scale + 0.25 : scale"> + </Button>
      </div>
      <div class="flex gap-2 justify-center items-center" v-if="pdf">
        <VuePDF :pdf="pdf" :page="page" :scale="scale" />
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 justify-center items-center">
        <span class="shadow-sm p-10">No file founded.</span>
      </div>
    </div>
  </div>
</template>
