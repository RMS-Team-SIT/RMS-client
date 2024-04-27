div
<script setup>
import Badge from '@/components/common/badge.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import RoomService from '@/services/RoomService';
import CountUp from 'vue-countup-v3';
import {
  ArrowTopRightOnSquareIcon,
  ChartPieIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';
import back from '@/components/common/back.vue';
import IncomeChart from '@/components/residence/charts/income.vue';
import { useUserStore } from '@/stores/user.store';
import Loading from '@/components/common/loading.vue';
import Alert from '@/components/common/alert.vue';

const router = useRouter();
const userStore = useUserStore();

const room = ref(null);
const route = useRoute();
const isLoading = ref(true);
const { notify } = useNotification();
const residenceId = ref('');
const roomId = ref('');
const stats = ref({
  paidBills: 0,
  uploadedBills: 0,
  unpaidBills: 0,
  totalUnpaidAmount: 0,
  paidHistory: new Array(12).fill(0),
  avaragePrice: 0,
  avarageElectricityUsage: 0,
  avarageWaterUsage: 0,
});

const fetchRoom = async () => {
  try {
    const response = await RoomService.fetchOneRoomInResidence(
      residenceId.value,
      roomId.value
    );
    if (response.status === 200) {
      let result = await response.json();
      room.value = result;
      console.log('room,', result);
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
        type: 'error',
      });
      router.push({ name: 'room', params: { residenceId: residenceId } });
    }
  } catch (error) {
    console.error(error);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
    router.push({ name: 'room', params: { residenceId: residenceId } });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  userStore.fetchUserData();
  const renter = userStore.getUser;
  residenceId.value = renter.residence._id;
  // TODO: Fix some renter not have room
  roomId.value = renter.room._id;
  await fetchRoom();

  // Calculate stats (stats can fetch in renter data)
  console.log('renter', renter);
  stats.value.paidBills = renter.billRooms.filter(
    (billRoom) => billRoom.status === 'PAID'
  ).length;
  stats.value.uploadedBills = renter.billRooms.filter(
    (billRoom) => billRoom.status === 'UPLOADED'
  ).length;
  stats.value.unpaidBills = renter.billRooms.filter(
    (billRoom) => billRoom.status === 'UNPAID'
  ).length;
  stats.value.totalUnpaidAmount = renter.billRooms
    .filter((billRoom) => billRoom.status === 'UNPAID')
    .reduce((acc, billRoom) => acc + billRoom.totalPrice, 0);

  // Calculate history
  const currentYear = new Date().getFullYear();
  renter.billRooms
    // .filter((billRoom) => billRoom.status === 'PAID')
    .forEach((billRoom) => {
      const month = new Date(billRoom.meterRecord.record_date).getMonth();
      const year = new Date(billRoom.meterRecord.record_date).getFullYear();
      if (year === currentYear) {
        stats.value.paidHistory[month] += billRoom.totalPrice;
      }
    });

  // Calculate avarages
  const billCount = renter.billRooms.length;
  stats.value.avarageElectricityUsage =
    renter.billRooms.reduce(
      (acc, billRoom) => acc + billRoom.totalElectricMeterUsage,
      0
    ) / billCount;
  stats.value.avarageWaterUsage =
    renter.billRooms.reduce(
      (acc, billRoom) => acc + billRoom.totalWaterMeterUsage,
      0
    ) / billCount;
  stats.value.avaragePrice =
    renter.billRooms.reduce((acc, billRoom) => acc + billRoom.totalPrice, 0) /
    billCount;

  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-else class="py-10 px-10 md:px-5 w-full min-h-screen">
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'แดชบอร์ด', pathName: 'renter-dashboard' },
      ]"
    />
    <h1
      class="text-xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
    >
      <ChartPieIcon class="h-8 w-8 inline-block" /> แดชบอร์ดผู้เช่า
    </h1>

    <!-- Alert -->

    <Alert v-if="stats.unpaidBills">
      มีบิลค้างชำระจำนวน
      {{ stats.unpaidBills }}
      รายการ
    </Alert>

    <!-- Grid -->
    <div class="grid grid-cols-4 gap-2 mt-2">
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">จำนวนบิลที่ชำระแล้ว</h3>
        <p class="flex gap-2 items-end">
          <CountUp :end-val="stats.paidBills" class="text-6xl text-green-400" />
          บิล
        </p>
      </div>
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">
          จำนวนบิลที่อัพโหลดหลักฐานแล้ว
        </h3>
        <p class="flex gap-2 items-end">
          <CountUp
            :end-val="stats.uploadedBills"
            class="text-6xl text-dark-blue-200"
          />
          บิล
        </p>
      </div>
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">จำนวนบิลค้างชำระทั้งหมด</h3>
        <p class="flex gap-2 items-end">
          <CountUp :end-val="stats.unpaidBills" class="text-6xl text-red-400" />
          บิล
        </p>
      </div>
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">ยอดค้างชำระทั้งหมด</h3>
        <p class="flex gap-2 items-end">
          <CountUp
            :end-val="stats.totalUnpaidAmount"
            class="text-6xl text-red-400"
          />
          บาท
        </p>
      </div>
    </div>

    <!-- Divider -->
    <Divider class="my-5" />
    <div class="grid grid-cols-2 gap-2">
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-2 p-5">
          จำนวนเงินการจ่ายบิลที่ผ่านมาในปีนี้
        </h3>
        <IncomeChart :data="stats.paidHistory" />
      </div>
      <div class="gap-2 flex-col">
        <div
          class="p-5 bg-white rounded-lg shadow-md border border-gray-200"
        >
          <h3 class="text-lg font-semibold mb-2">
            ค่าใช้จ่ายโดยเฉลี่ยต่อเดือน
          </h3>
          <p class="flex gap-2 items-end">
            <CountUp
              :end-val="stats.avaragePrice"
              class="text-6xl text-dark-blue-200"
            />
            บาท
          </p>
        </div>
        <div
          class="p-5 bg-white rounded-lg shadow-md border border-gray-200 mt-2"
        >
          <h3 class="text-lg font-semibold mb-2">
            อัตราการใช้ไฟฟ้าโดยเฉลี่ยต่อเดือน
          </h3>
          <p class="flex gap-2 items-end">
            <CountUp
              :end-val="stats.avarageElectricityUsage"
              class="text-6xl text-dark-blue-200"
            />
            หน่วย
          </p>
        </div>
        <div
          class="p-5 bg-white rounded-lg shadow-md border border-gray-200 mt-2"
        >
          <h3 class="text-lg font-semibold mb-2">
            อัตราการใช้น้ำโดยเฉลี่ยต่อเดือน
          </h3>
          <p class="flex gap-2 items-end">
            <CountUp
              :end-val="stats.avarageWaterUsage"
              class="text-6xl text-dark-blue-200"
            />
            หน่วย
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
