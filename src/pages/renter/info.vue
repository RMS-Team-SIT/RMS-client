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
        { name: 'ข้อมูลผู้เช่า', pathName: 'renter-info' },
      ]"
    />

    <div class="bg-white p-10 shadow rounded-lg border mt-2">
      <div class="flex justify-between">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          <UserIcon class="w-8 h-8 text-dark-blue-200" />
          ข้อมูลผู้เช่า
        </h1>
      </div>

      <div>
        <p class="mt-5">
          ชื่อผู้เช่า:
          {{
            renter ? renter.firstname + ' ' + renter.lastname : 'ไม่มีผู้เช่า'
          }}
        </p>
        <p>
          เบอร์โทร:
          {{ renter ? renter.phone : 'ไม่มีผู้เช่า' }}
        </p>
        <p>
          อีเมล:
          {{ renter ? renter.email : 'ไม่มีผู้เช่า' }}
        </p>
        <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
          ข้อมูลบัญชีผู้เช่า
        </h1>
        <p>
          ชื่อผู้ใช้:
          {{ renter ? renter.username : 'ไม่มีผู้เช่า' }}
        </p>
        <p>
          รหัสผ่าน:
          <!-- {{ renter ? renter.password : 'ไม่มีผู้เช่า' }} -->
          ********
        </p>
        <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
          ไฟล์เอกสาร
        </h1>
        <div class="flex gap-2">
          สำเนาบัตรประชาชน:
          <div v-if="renter?.copyOfIdCard" class="underline">
            <router-link
              target="_blank"
              class="flex items-center gap-2"
              :to="{
                name: 'pdf-preview',
                query: {
                  filename: renter.copyOfIdCard,
                },
              }"
            >
              ดูไฟล์
              <ArrowTopRightOnSquareIcon class="h-4 w-4" />
            </router-link>
          </div>
          <div v-else>
            <span class="text-red-500">ไม่มีไฟล์ในระบบ</span>
          </div>
        </div>
        <div class="flex gap-2">
          สัญญาเช่า:
          <div v-if="renter?.renterContract" class="underline">
            <router-link
              target="_blank"
              class="flex items-center gap-2"
              :to="{
                name: 'pdf-preview',
                query: {
                  filename: renter.renterContract,
                },
              }"
            >
              ดูไฟล์
              <ArrowTopRightOnSquareIcon class="h-4 w-4" />
            </router-link>
          </div>
          <div v-else>
            <span class="text-red-500">ไม่มีไฟล์ในระบบ</span>
          </div>
        </div>
      </div>
    
    </div>
  </div>
</template>

<style scoped></style>
