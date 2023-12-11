<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import ImagePreview from '@/components/common/image.preview.vue';
import RoomSection from '@/components/room/room.section.vue';
import RentalSection from '@/components/rental/rental.section.vue';
import Button from '@/components/common/button.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import ResidentInfo from '@/components/resident/resident.info.vue';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const { notify } = useNotification();
const isLoading = ref(true);

const resident = reactive({
  data: null,
});

const fetchData = async () => {
  const response = await ResidentServices.fetchResident(residentId);
  if (response.status === 200) {
    let result = await response.json();
    resident.data = result;
    // parse residentImage by adding base url
    resident.data.images = resident.data.images.map((imageName) => {
      return FileService.getFile(imageName);
    });
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch resident data',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="card w-full" v-if="resident.data">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Resident' },
            { name: resident.data.name },
          ]"
        />
      </div>

      <div>
        <div class="p-4 card shadow-xs bg-white">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            {{ route.meta.title }}: {{ resident.data.name }}
          </h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 mt-2">
          <ResidentInfo :resident="resident.data" />

          <ImagePreview
            :imageUrls="resident.data.images"
            preview-from="url"
            class="min-h-full"
          />
        </div>

        <div class="grid grid-cols-1">
          <RoomSection
            :rooms="resident.data.rooms"
            :defaultWaterPriceRate="resident.data.defaultWaterPriceRate"
            :defaultLightPriceRate="resident.data.defaultLightPriceRate"
          />
        </div>

        <div class="grid grid-cols-1">
          <RentalSection
            :residentId="residentId"
            :rentals="resident.data.rentals"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
