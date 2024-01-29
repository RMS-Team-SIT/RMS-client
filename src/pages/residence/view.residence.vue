<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import RoomSection from '@/components/room/room.section.vue';
import RenterSection from '@/components/renter/renter.section.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import ResidenceInfo from '@/components/residence/residence.info.vue';
import PaidChart from '@/components/room/charts/paid.chart.vue';
import AvailableChart from '@/components/room/charts/available.chart.vue';

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

        <!-- Quick link Section -->
        <section class="mt-12">
          <h2 class="text-3xl font-semibold mb-6">Quick link</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Service Card -->
            <div
              class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
            >
              <h3 class="text-xl font-semibold mb-2">Dashboard</h3>
              <p>Access to your residence dashboard.</p>
            </div>

            <!-- Service Card -->
            <div
              class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
            >
              <h3 class="text-xl font-semibold mb-2">Manage Renters</h3>
              <p>Access to all of your renters in this residence.</p>
            </div>

            <!-- Service Card -->
            <div
              class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
            >
              <h3 class="text-xl font-semibold mb-2">Manage Room</h3>
              <p>Access to all of your room in this residence.</p>
            </div>
          </div>
        </section>

        <div id="dashboard" class="mt-2">
          <h2 class="text-3xl font-semibold mb-6">Dashboard</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Room paid bill status</h3>
              <PaidChart />

              <p class="text-xs p-5">Paid status will show here.</p>
            </div>

            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Room Status</h3>
              <AvailableChart />
              <p class="text-xs p-5">Room status will show here.</p>
            </div>

            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Room Status</h3>
              <AvailableChart />
              <p class="text-xs p-5">Room status will show here.</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Room Status</h3>
              <AvailableChart />
              <p class="text-xs p-5">Room status will show here.</p>
            </div>

            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Renters Count</h3>
              <p class="text-xs p-5">Room status will show here.</p>
            </div>

            <div class="bg-white rounded-lg shadow-md">
              <h3 class="text-xl font-semibold mb-2 p-5">Room Count</h3>
              <p class="text-xs p-5">Room status will show here.</p>
            </div>
          </div>
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
