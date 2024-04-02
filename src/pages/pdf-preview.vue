<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import Button from '@/components/common/button.vue';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const timeoutTime = 1000 * 3; // 3 secounds = 1000 * 10 milliseconds
const { notify } = useNotification();

const fileName = route.query.filename;
if (!fileName) {
  router.push({ name: 'home' });
}

const page = ref(1);
const scale = ref(0.5);
const { pdf, pages } = usePDF(FileService.getFile(fileName));

onBeforeMount(() => {
  const timeout = setTimeout(() => {
    if (!pdf.value) {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถดึงข้อมูลไฟล์ได้',
        type: 'error',
      });
      router.push({ name: 'home' });
    }
  }, timeoutTime);
  return () => clearTimeout(timeout);
});
</script>

<template>
  <div class="relative bg-white p-10">
    <div v-if="pdf">
      <h1 class="text-xl font-semibold text-dark-blue-200 text-center">
        {{ fileName }}
      </h1>
     
      <div class="flex gap-2 justify-center items-center mt-2">
        <Button @click="scale = scale > 0.25 ? scale - 0.25 : scale">
          -
        </Button>
        <span>{{ scale * 100 }}%</span>
        <Button @click="scale = scale < 2 ? scale + 0.25 : scale"> + </Button>
      </div>
      <div class="flex gap-2 justify-center items-center" v-if="pdf">
        <VuePDF :pdf="pdf" :page="page" :scale="scale" />
      </div>
      <div class="flex gap-4 justify-center items-center">
        <Button
          btnType="secondary-pill"
          @click="page = page > 1 ? page - 1 : page"
          >
          <ArrowLeftIcon class="h-5 w-5" />
          </Button
        >
        <span class="">{{ page }} / {{ pages }}</span>
        <Button
        btnType="secondary-pill"
          @click="page = page < pages ? page + 1 : page"
          >
          <ArrowRightIcon class="h-5 w-5" />
          </Button
        >
      </div>
    </div>
    <div v-else>
      <div class="flex gap-2 justify-center items-center min-h-screen">
        <div>
          <span class="p-10">กำลังดึงข้อมูล...</span>
          <Loading />
        </div>
      </div>
    </div>
  </div>
</template>
