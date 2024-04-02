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
  BoltIcon,
  ChartPieIcon,
  Cog6ToothIcon,
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

const renter = ref(null);
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
  renter.value = userStore.getUser;
  console.log('renter', renter.value);
  // Set residenceId
  residenceId.value = renter.value.residence._id;
  roomId.value = renter.value.room._id;
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
        { name: 'ตั้งค่าผู้เช่า', pathName: 'renter-settings' },
      ]"
    />
    <!-- <h1
      class="text-xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
    >
      <ChartPieIcon class="h-8 w-8 inline-block" /> ตั้งค่าผู้เช่า
    </h1> -->

    <div class="bg-white p-10 shadow rounded-lg border mt-2">
      <div class="flex justify-between">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          <Cog6ToothIcon class="w-8 h-8 text-dark-blue-200" />
          ตั้งค่าผู้เช่า
        </h1>
      </div>

      <div class="grid grid-cols-2 gap-2 col-span-2 mt-5 w-1/2">
        <div class="bg-white rounded-lg">
          <h3 class="text-lg font-semibold mb-2">การรับแจ้งเตือนผ่านอีเมล</h3>
          <p class="flex gap-2 items-end">
            <input type="checkbox" class="toggle toggle-success" checked />
            เปิดใช้งาน
          </p>
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<style scoped></style>
