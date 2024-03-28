<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import Button from '@/components/common/button.vue';
import RoomListTable from '@/components/room/room.list.table.vue';
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
import back from '@/components/common/back.vue';
import RentList from '@/components/rent/rent.list.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});

const fetchData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log({ residence: result });
    residence.data = result;
    // sort room floor by ascending order then room name
    residence.data.rooms = residence.data.rooms.sort((a, b) => {
      if (a.floor === b.floor) {
        return a.name.localeCompare(b.name);
      }
      return a.floor - b.floor;
    });
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
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
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-if="residence.data" class="py-10 px-10 md:px-20 w-full min-h-screen">
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'จัดการ', pathName: 'manage' },
        {
          name: `${residence.data.name}`,
          pathName: 'dashboard',
          params: { residenceId },
        },
        { name: 'จัดการห้องพัก' },
      ]"
    />

    <back :to="{ name: 'dashboard', params: { residenceId } }" class="mt-5" />

    <div class="bg-white p-10 mt-2 shadow rounded-lg border">
      <div class="flex justify-between">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          <!-- <UserIcon class="w-8 h-8 text-dark-blue-200" /> -->
          <ArrowRightCircleIcon class="w-8 h-8 text-dark-blue-200" />
          <!-- <HomeIcon class="w-8 h-8 text-dark-blue-200" /> -->
          จัดการการย้ายเข้าอยู่ และออกห้อง
        </h1>
      </div>
      <RentList
        class="mt-5"
        @refetch="fetchData"
        :residenceId="residenceId"
        :rooms="residence.data.rooms"
        :roomTypes="residence.data.roomTypes"
        :residenceData="residence.data"
      />
    </div>
  </div>
</template>

<style scoped></style>
