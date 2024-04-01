<script setup>
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BanknotesIcon,
  BellAlertIcon,
  ChartPieIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import Divider from '../common/divider.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;

const goto = (name) => {
  router.push({ name: name, params: { residenceId: residenceId } });
};

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div
    v-show="isSidebarOpen"
    class="relative flex flex-col bg-clip-border rounded-sm bg-white text-gray-700 w-full max-w-[15rem] p-4 border sm:w-auto sm:max-w-[15rem] sm:text-sm text-xs"
  >
    <nav class="flex flex-col gap-1 p-2 text-gray-700">
      <div class="divider font-bold divider-start">จัดการ</div>
      <div
        @click="goto('admin-dashboard')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <ChartPieIcon class="h-5 w-5" />
        </div>
        แดชบอร์ด
      </div>

      <div class="divider font-bold divider-start">ระบบจัดการหอพัก</div>
      <div
        @click="goto('room')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <HomeIcon class="h-5 w-5" />
        </div>
        จัดการหอพักทั้งหมด
      </div>

     
      <div class="divider font-bold divider-start">ระบบจัดการผู้ใช้</div>

      <div
        @click="goto('renter')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <UserIcon class="h-5 w-5" />
        </div>
        ข้อมูลผู้เช่า
      </div>

     
      <div class="divider font-bold divider-start">อื่น ๆ</div>

      <div
        @click="goto('info')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <Cog6ToothIcon class="h-5 w-5" />
        </div>
        ตั้งค่าระบบ
      </div>
    </nav>
  </div>
  <button
    class="bg-clip-border h-10 text-gray-700 p-1 hover:bg-blue-50 hover:bg-opacity-80 hover:text-blue-900 border border-l-0"
    @click="toggleSidebar"
    :class="{ 'bg-black text-white': !isSidebarOpen }"
  >
    <ChevronDoubleRightIcon v-if="!isSidebarOpen" class="h-4 w-4" />
    <ChevronDoubleLeftIcon v-else class="h-4 w-4" />
  </button>
</template>

<style scoped></style>
