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
import PaidChart from '@/components/residence/charts/paid.chart.vue';
import AvailableChart from '@/components/residence/charts/available.chart.vue';
import IncomeChart from '@/components/residence/charts/income.chart.vue';
import Banner from '@/components/common/banner.vue';
import { ChartPieIcon } from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';

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
    console.log(result);
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
  <div v-if="residence.data" class="bg-gray-50">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'Home', pathName: 'home' },
          { name: 'Manage', pathName: 'manage' },
          { name: 'Residence' },
          { name: `${residence.data.name}` },
        ]"
      />

      <h1 class="text-2xl font-semibold text-dark-blue-200">
        {{ route.meta.title }}: {{ residence.data.name }}
      </h1>

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
        <!-- <h2 class="text-3xl font-semibold mb-6">Quick link</h2> -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">Dashboard</h3>
            <p>Access to your residence dashboard.</p>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">Manage Renters</h3>
            <p>Access to all of your renters in this residence.</p>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">Manage Room</h3>
            <p>Access to all of your room in this residence.</p>
          </div>
        </div>
      </section>

      <section class="mt-12">
        <h1 class="text-2xl font-semibold text-dark-blue-200 my-5">
          <ChartPieIcon class="h-8 w-8 inline-block" /> Overview
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">
              Room paid bill status
            </h3>
            <PaidChart />
            <p class="text-xs p-5">Paid status will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">Room Status</h3>
            <AvailableChart />
            <p class="text-xs p-5">Room status will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">Renters Count</h3>
            <count-up class="mb-2 p-5 text-6xl" :end-val="500"></count-up>
            <p class="text-xs p-5">Total renter in this residence.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">Room Count</h3>
            <count-up class="mb-2 p-5 text-6xl" :end-val="30"></count-up>
            <p class="text-xs p-5">Total room in this residence.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md xl:col-span-2">
            <h3 class="text-xl font-semibold mb-2 p-5">Residence Income</h3>
            <IncomeChart />
            <p class="text-xs p-5">Room status will show here.</p>
          </div>
        </div>
      </section>

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
</template>

<style scoped></style>
