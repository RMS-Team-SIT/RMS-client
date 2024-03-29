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
import Divider from './divider.vue';
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
    class="relative flex flex-col bg-clip-border rounded-sm bg-white text-gray-700 w-full max-w-[20rem] p-4 border"
  >
    <button
      @click="goto('home')"
      class="flex items-center gap-2 bg-clip-border bg-white text-gray-700 p-4 hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none border"
    >
      <ArrowLeftCircleIcon class="h-5 w-5" />
      กลับสู่หน้าหอพักทั้งหมด
    </button>

    <nav
      class="flex flex-col gap-1 min-w-[240px] p-2 text-base font-normal text-gray-700"
    >
      <div class="divider font-bold divider-start">หอพัก</div>
      <div
        @click="goto('dashboard')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <ChartPieIcon class="h-5 w-5" />
        </div>
        แดชบอร์ด
      </div>

      <div class="divider font-bold divider-start">ระบบจัดการห้อง</div>
      <div
        @click="goto('room')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <HomeIcon class="h-5 w-5" />
        </div>
        จัดการห้อง
      </div>

      <div
        @click="goto('room-type')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <HomeModernIcon class="h-5 w-5" />
        </div>
        จัดการประเภทห้อง
      </div>

      <div class="divider font-bold divider-start">ระบบจัดการผู้เช่า</div>

      <div
        @click="goto('renter')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="grid place-items-center mr-4">
          <UserIcon class="h-5 w-5" />
        </div>
        จัดการผู้เช่า
      </div>

      <div
        @click="goto('rent')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="place-items-center mr-4 flex">
          <ArrowRightCircleIcon class="h-5 w-5" />
        </div>
        การย้ายเข้าและย้ายออก
      </div>

      <div class="divider font-bold divider-start">
        การจดมิเตอร์ และการราคาต่างๆ
      </div>

      <div
        @click="goto('fee')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="place-items-center mr-4 flex">
          <CreditCardIcon class="h-5 w-5" />
        </div>
        จัดการราคาต่าง ๆ
      </div>

      <div
        @click="goto('meter-record')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="place-items-center mr-4 flex">
          <AdjustmentsHorizontalIcon class="h-5 w-5" />
        </div>
        บันทึกค่าน้ำค่าไฟ
      </div>

      <div class="divider font-bold divider-start">
        การสร้างบิลและการชำระเงิน
      </div>

      <div
        @click="goto('bill')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="place-items-center mr-4 flex">
          <BanknotesIcon class="h-5 w-5" />
        </div>
        จัดการบิล
      </div>

      <div
        @click="goto('payment')"
        role="button"
        tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none"
      >
        <div class="place-items-center mr-4 flex">
          <CreditCardIcon class="h-5 w-5" />
        </div>
        จัดการช่องทางการชำระเงิน
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
        จัดการข้อมูลอื่น ๆ
      </div>
    </nav>
  </div>
  <button
    class="bg-clip-border h-20 bg-white text-gray-700 p-1 hover:bg-blue-50 hover:bg-opacity-80 hover:text-blue-900 border border-l-0"
    @click="toggleSidebar"
  >
    <ChevronDoubleRightIcon v-if="!isSidebarOpen" class="h-4 w-4" />
    <ChevronDoubleLeftIcon v-else class="h-4 w-4" />
  </button>
</template>

<style scoped></style>
