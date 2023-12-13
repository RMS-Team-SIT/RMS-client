<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import ImagePreview from '@/components/common/image.preview.vue';
import RoomSection from '@/components/room/room.section.vue';
import RenterSection from '@/components/renter/renter.section.vue';
import Button from '@/components/common/button.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import ResidenceInfo from '@/components/residence/residence.info.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});

const fetchData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    residence.data = result;
    // parse residenceImage by adding base url
    residence.data.images = residence.data.images.map((imageName) => {
      return FileService.getFile(imageName);
    });
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch residence data',
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
  <div class="card w-full" v-if="residence.data">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Residence' },
            { name: `${residence.data.name}` },
          ]"
        />
      </div>

      <div>
        <div class="p-4 card shadow-xs bg-white">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            {{ route.meta.title }}: {{ residence.data.name }}
          </h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 mt-2">
          <ResidenceInfo :residence="residence.data" />

          <ImagePreview
            :imageUrls="residence.data.images"
            preview-from="url"
            class="min-h-full"
          />
        </div>

        <div class="grid grid-cols-1">
          <RoomSection
            :rooms="residence.data.rooms"
            :defaultWaterPriceRate="residence.data.defaultWaterPriceRate"
            :defaultLightPriceRate="residence.data.defaultLightPriceRate"
          />
        </div>

        <div class="grid grid-cols-1">
          <RenterSection
            :residenceId="residenceId"
            :renters="residence.data.renters"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>