<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import { ChartPieIcon, HomeIcon, UserIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/button.vue';
import RenterListTable from '@/components/renter/renter.list.table.vue';
import back from '@/components/common/back.vue';
import ModernAlert from '@/components/common/modern-alert.vue';
import { useClipboard } from '@vueuse/core';

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

const loginLink = `${
  import.meta.env.VITE_HOST
}/auth/residence/${residenceId}/signin`;

const { text, copy, copied, isSupported } = useClipboard();

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-if="residence.data" class="py-10 px-10 md:px-5 w-full min-h-screen">
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'จัดการ', pathName: 'manage' },
        {
          name: `${residence.data.name}`,
          pathName: 'dashboard',
          params: { residenceId },
        },
        { name: 'จัดการผู้เช่า' },
      ]"
    />

    <!-- <back :to="{ name: 'dashboard', params: { residenceId } }" /> -->

    <ModernAlert
      title="การเข้าสู่ระบบของผู้เช่า"
      :text="`ผู้เช่าสามารถเข้าสู่ระบบได้โดยใช้ลิงก์นี้: ${loginLink}`"
      linktext="คัดลอกลิงก์"
      @click="copy(loginLink)"
    />
    <div class="grid grid-cols-1">
      <div class="bg-white p-10 mt-2 shadow rounded-lg border">
        <div class="flex justify-between">
          <h1 class="text-2xl font-semibold text-dark-blue-200 flex gap-2">
            <UserIcon class="w-8 h-8" />
            ผู้เช่าทั้งหมด
          </h1>
          <router-link
            :to="{
              name: 'create-renter',
              params: {
                residenceId,
              },
            }"
          >
            <Button btnType="primary">เพิ่มข้อมูลผู้เช่า</Button>
          </router-link>
        </div>
        <RenterListTable
          :residenceId="residenceId"
          :renters="residence.data.renters"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
