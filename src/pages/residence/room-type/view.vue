<script setup>
import Badge from '@/components/common/badge.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import RoomService from '@/services/RoomService';
import {
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';
import RoomTypeService from '@/services/RoomTypeService';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const room = ref(null);
const roomTypeId = route.params.roomTypeId;
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const { notify } = useNotification();

const fetchRoom = async () => {
  try {
    const response = await RoomTypeService.fetchOneResidence(
      residenceId,
      roomTypeId
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
      //   router.push({ name: 'room', params: { residenceId: residenceId } });
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

onMounted(() => {
  fetchRoom();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-if="room" class="py-10 px-10 md:px-5 w-full min-h-screen">
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'จัดการ', pathName: 'manage' },
        {
          name: `แดชบอร์ด`,
          pathName: 'dashboard',
          params: { residenceId },
        },
        {
          name: 'จัดการประเภทห้อง',
          pathName: 'room-type',
          params: { residenceId },
        },
        { name: 'ดูข้อมูลประเภทห้อง' },
      ]"
    />
    <back :to="{ name: 'room-type', params: { residenceId } }" />
    <div class="bg-white mt-5 rounded-lg border p-5 w-full">
      <!-- Head -->
      <div class="flex justify-between">
        <h1 class="text-2xl font-semibold text-dark-blue-200">
          ประเภทห้องพักห้องพัก: {{ room.name }}
        </h1>
        <Button
          btnType="primary"
          @click="
            router.push({
              name: 'update-room',
              params: { residenceId, roomId: room.id },
            })
          "
        >
          แก้ไขข้อมูล
        </Button>
      </div>
      <!-- Body -->
      <!-- row 1 -->
      <div class="mt-5 grid grid-cols-2 gap-4">
        <!-- ข้อมูลประเภทห้อง -->
        <div class="space-y-3 rounded-lg col-span-3">
          <p>รูปแบบห้อง: {{ room.category }}</p>
          <p>ขนาดห้อง: {{ room.size }} ตร.ม.</p>
          <p>คำอธิบาย: {{ room.description || 'ไม่มีคำอธิบาย' }}</p>
          <p>อัตราค่าเช่าต่อเดือน: {{ room.price.toLocaleString() }} บาท</p>
          <ImagePreview
            :imageUrls="room.images.map((i) => FileService.getFile(i))"
            preview-from="url"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
