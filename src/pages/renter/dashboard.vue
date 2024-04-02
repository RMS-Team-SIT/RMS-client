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

const router = useRouter();
const userStore = useUserStore();

const room = ref(null);
const route = useRoute();
const isLoading = ref(true);
const { notify } = useNotification();
const residenceId = ref('');
const roomId = ref('');

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
  roomId.value = renter.room._id;
  await fetchRoom();

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

    <!-- Grid -->
    <div class="grid grid-cols-4 gap-2">
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">จำนวนบิลที่ชำระแล้ว</h3>
        <p class="flex gap-2 items-end">
          <CountUp :end-val="1" class="text-6xl text-green-400" />
          บิล
        </p>
      </div>
      <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-semibold mb-2">จำนวนบิลค้างชำระ</h3>
        <p class="flex gap-2 items-end">
          <CountUp :end-val="1" class="text-6xl text-red-400" />
          บิล
        </p>
      </div>
      <div
        class="p-5 bg-white rounded-lg shadow-md border border-gray-200 col-span-2"
      >
        <h3 class="text-lg font-semibold mb-2">ยอดค้างชำระ</h3>
        <p class="flex gap-2 items-end">
          <CountUp :end-val="10000" class="text-6xl text-red-400" />
          บาท
        </p>
      </div>

      <div
        class="p-5 bg-white rounded-lg shadow-md border border-gray-200 col-span-4"
      >
        <h3 class="text-xl font-semibold mb-2 p-5">
          จำนวนเงินการจ่ายบิลที่ผ่านมา
        </h3>
        <IncomeChart :data="[0, 0, 0, 0, 0, 0, 0, 0, 4000, 5000, 6000, 4000]" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
