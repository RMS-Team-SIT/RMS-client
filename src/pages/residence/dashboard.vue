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
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลหอพักได้',
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
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          { name: `${residence.data.name}` },
          { name: 'แดชบอร์ด' },
        ]"
      />

      <section>
        <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <ChartPieIcon class="h-8 w-8 inline-block" /> ข้อมูลภาพรวม :
          {{ residence.data.name }}
        </h1>
        <div class="stats shadow  stats-vertical lg:stats-horizontal w-full">
          <div
            class="stat hover:cursor-pointer"
            @click="router.push({ name: 'renter', params: { residenceId } })"
          >
            <div class="stat-figure text-primary">
              <UserIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">ผู้เช่าทั้งหมด</div>
            <div class="stat-value text-primary">
              <CountUp :end-val="residence.data.renters.length" />
            </div>
            <div class="stat-desc">จำนวนผู้เช่าทั้งหมดในระบบ</div>
          </div>

          <div
            class="stat hover:cursor-pointer"
            @click="router.push({ name: 'room', params: { residenceId } })"
          >
            <div class="stat-figure text-secondary">
              <HomeIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">จำนวนห้อง</div>
            <div class="stat-value text-secondary">
              <CountUp :end-val="residence.data.rooms.length" />
            </div>
            <div class="stat-desc">จำนวนห้องทั้งหมดในระบบ</div>
          </div>

          <div
            class="stat hover:cursor-pointer"
            @click="router.push({ name: 'payment', params: { residenceId } })"
          >
            <div class="stat-figure text-secondary">
              <CreditCardIcon class="h-8 w-8 inline-block" />
            </div>
            <div class="stat-title">ช่องทางการชำระเงิน</div>
            <div class="stat-value text-secondary">
              <CountUp :end-val="residence.data.payments.length" />
            </div>
            <div class="stat-desc">ช่องทางการชำระเงินทั้งหมดในระบบ</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-5">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">
              สถานะการจ่ายค่าห้องทั้งหมด
            </h3>
            <PaidChart class="h-28 mx-auto" />
            <p class="text-xs p-5">Paid status will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">ห้องว่างในระบบ</h3>
            <AvailableChart class="h-28 mx-auto" />
            <p class="text-xs p-5">Room available will show here.</p>
          </div>

          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2 p-5">
              รายได้ของหอพักในปีนี้
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
          <LinkIcon class="h-8 w-8 inline-block" /> Quick Links
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          <div
            @click="router.push({ name: 'renter', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">ระบบจัดการผู้เช่า</h3>
            <p>เข้าสู่ระบบจัดการผู้เช่าในระบบ</p>
          </div>

          <div
            @click="router.push({ name: 'room', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">ระบบจัดการห้อง</h3>
            <p>เข้าสู่ระบบจัดการห้องในระบบ</p>
          </div>

          <div
            @click="router.push({ name: 'info', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold mb-2">จัดการข้อมูลทั่วไป</h3>
            <p>เข้าสู่หน้าการจัดการข้อมูลทั่วไป</p>
          </div>

          <div
            @click="router.push({ name: 'payment', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold">จัดการข้อมูลช่องทางการชำระเงิน</h3>
            <p>เข้าสู่หน้าจัดการข้อมูลช่องทางการชำระเงิน </p>
          </div>

          <div
            @click="router.push({ name: 'bill-system', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold">ระบบบันทึกค่าน้ำ ค่าไฟ</h3>
            <p>เข้าสู่หน้าระบบบันทึกค่าน้ำ ค่าไฟ</p>
          </div>

          <div
            @click="router.push({ name: 'bill-system', params: { residenceId } })"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer"
          >
            <h3 class="text-xl font-semibold">จัดการบิล</h3>
            <p>เข้าสู่หน้าจัดการบิล </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
