<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Loading from '@/components/common/loading.vue';
import PaymentListTable from '@/components/payment/payment.list.table.vue';
import Button from '@/components/common/button.vue';
import Badge from '@/components/common/badge.vue';

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

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-if="residence.data" class="bg-gray-50 min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: `${residence.data.name}`,
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'ช่องทางการชำระเงิน' },
        ]"
      />
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'dashboard', params: { residenceId } })"
      >
        กลับหน้าแดชบอร์ด
      </Button>
      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            ระบบจัดการเรียกเก็บเงิน
          </h1>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <div class="card w-full bg-base-100 shadow-xl rounded-lg mt-5 col-span-1">
          <div class="card-body">
            <h2 class="card-title">ตั้งค่าการเรียกเก็บเงิน</h2>
            <p class="text-lg">เก็บเงินอัตโนมัติ: <Badge>เปิดใช้งาน</Badge></p>
            <p class="text-lg">เก็บเงินทุกวันที่:วันที่ 1 ของทุกเดือน</p>
          </div>
        </div>
        <div class="card w-full bg-base-100 shadow-xl rounded-lg mt-5 col-span-3 ">
          <div class="card-body">
            <h2 class="card-title">ตั้งค่าการเรียกเก็บเงิน</h2>
            <p class="text-lg">เก็บเงินอัตโนมัติ: <Badge>เปิดใช้งาน</Badge></p>
            <p class="text-lg">เก็บเงินทุกวันที่:วันที่ 1 ของทุกเดือน</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
