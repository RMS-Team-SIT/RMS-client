<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import PaidChart from '@/components/residence/charts/paid.chart.vue';
import AvailableChart from '@/components/residence/charts/available.chart.vue';
import IncomeChart from '@/components/residence/charts/income.chart.vue';
import Banner from '@/components/common/banner.vue';
import {
  BanknotesIcon,
  ChartPieIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});
const stats = reactive({
  renterCount: 0,
  roomCount: 0,
  avaiableRoomCount: 0,
  notavaiableRoomCount: 0,
  paidRoomCount: 0,
  unpaidRoomCount: 0,
  income: 0,
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

      <section class="mt-5">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <ChartPieIcon class="h-8 w-8 inline-block" /> Overview :
          {{ residence.data.name }}
        </h1>
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <UserIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">Renters</div>
            <div class="stat-value text-primary">
              <CountUp :end-val="residence.data.renters.length" />
            </div>
            <div class="stat-desc">All renter in this residence.</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <HomeIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">Rooms</div>
            <div class="stat-value text-secondary">
              <CountUp :end-val="residence.data.rooms.length" />
            </div>
            <div class="stat-desc">All room in this residence.</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <CreditCardIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">Payment Method</div>
            <div class="stat-value text-secondary">
              <CountUp :end-val="residence.data.rooms.length" />
            </div>
            <div class="stat-desc">All payment method.</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-5">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">
              Room paid bill status
            </h3>
            <PaidChart class="h-28 mx-auto" />
            <p class="text-xs p-5">Paid status will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">Room Available</h3>
            <AvailableChart class="h-28 mx-auto" />
            <p class="text-xs p-5">Room available will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">
              Residence Income (this year)
            </h3>
            <IncomeChart />
            <p class="text-xs p-5">Residence income will show here.</p>
          </div>
        </div>
      </section>

      <!-- Quick link Section -->
      <section class="mt-5">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <LinkIcon class="h-8 w-8 inline-block" /> Quick Link
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
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

          <div
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">Manage Residence data</h3>
            <p>Access to all of your room in this residence.</p>
          </div>

          <div
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold">Manage Payment</h3>
            <p>Access to all of your room in this residence.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>