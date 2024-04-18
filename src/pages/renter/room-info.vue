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
  HomeIcon,
  ShareIcon,
  UserIcon,
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
        { name: 'ข้อมูลห้องพัก', pathName: 'renter-info' },
      ]"
    />
   

    <div class="bg-white p-10 shadow rounded-lg border mt-2">
      <div class="flex justify-between">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          <HomeIcon class="w-8 h-8 text-dark-blue-200" />
          ข้อมูลห้องพัก
        </h1>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-5">
        <!-- ข้อมูลห้อง -->
        <div class="space-y-3 rounded-lg bg-white">
          <div class="flex justify-between">
            <h1 class="text-lg font-semibold text-dark-blue-200">
              ข้อมูลห้องพัก
            </h1>
          </div>
          <p>ชื่อห้อง: {{ room.name }}</p>
          <p>คำอธิบาย: {{ room.description || 'ไม่มีคำอธิบาย' }}</p>
          <p>ชั้น: {{ room.floor }}</p>
          <p>
            อัตราค่าเช่าต่อเดือน:
            {{ room.roomRentalPrice.toLocaleString() }} บาท
          </p>
          <p v-if="!isRenter">
            สถานะ:
            <Badge badgeType="success" v-if="room.status === 'AVAILABLE'"
              >ว่าง</Badge
            >
            <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
          </p>
          <p>
            ค่าน้ำ:
            {{ room.residence.defaultWaterPriceRate.toLocaleString() }}
            บาท/หน่วย
          </p>
          <p>
            ค่าไฟ:
            {{ room.residence.defaultElectricPriceRate.toLocaleString() }}
            บาท/หน่วย
          </p>

          <p>ค่าบริการอื่น ๆ :</p>
          <li v-for="fee in room.fees" :key="fee._id">
            {{ fee.feename }}: {{ fee.feeprice.toLocaleString() }} บาท
          </li>
        </div>
        <!-- ข้อมูลประเภทห้อง -->
        <div class="space-y-3 rounded-lg bg-white">
          <div class="flex justify-between">
            <h1 class="text-lg font-semibold text-dark-blue-200">
              ประเภทห้องพัก
            </h1>
          </div>
          <p>ประเภทห้อง: {{ room.type.name }}</p>
          <p>รูปแบบห้อง: {{ room.type.category }}</p>
          <p>ขนาดห้อง: {{ room.type.size }} ตร.ม.</p>
          <p>คำอธิบาย: {{ room.type.description || 'ไม่มีคำอธิบาย' }}</p>
          <ImagePreview
            :imageUrls="room.type.images.map((i) => FileService.getFile(i))"
            preview-from="url"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
