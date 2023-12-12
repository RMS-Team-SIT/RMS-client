<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import Button from '@/components/common/button.vue';
import Loading from '@/components/common/loading.vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const timeoutTime = 1000 * 10; // 10 secounds = 1000 * 10 milliseconds

const fileName = route.query.filename;
if (!fileName) {
  router.push({ name: 'home' });
}

const page = ref(1);
const scale = ref(0.5);
const { pdf, pages } = usePDF(FileService.getFile(fileName));

const timeout = setTimeout(() => {
  isLoading.value = false;
}, timeoutTime);

onBeforeMount(() => {
  if (pdf) {
    clearTimeout(timeout);
    isLoading.value = false;
  }
});
const temp = computed(() => {
  return pdf;
});
</script>

<template>
  <div class="relative bg-white p-10 shadow-md rounded">
    <div v-if="temp">
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
      <div class="flex gap-2 justify-center items-center min-h-screen">
        <span class="p-10">No file founded.</span>
        <Loading />
      </div>
    </div>
  </div>
</template>
