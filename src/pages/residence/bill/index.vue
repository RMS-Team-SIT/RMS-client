<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Loading from '@/components/common/loading.vue';
import Button from '@/components/common/button.vue';
import BillService from '@/services/BillService';
import BillListTable from '@/components/bill/bill.list.table.vue';
import dayjs from 'dayjs';
import Divider from '@/components/common/divider.vue';
import Badge from '@/components/common/badge.vue';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});

const bills = ref([]);

const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence', result);
    residence.data = result;

    // sort meter record by record_date
    residence.data.meterRecord.sort((a, b) => {
      return new Date(b.record_date) - new Date(a.record_date);
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

const fetchBills = async () => {
  const response = await BillService.findAllByResidenceId(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('bills', result);
    bills.value = result;
    // sort bills by record_date
    bills.value.sort((a, b) => {
      return (
        new Date(b.meterRecord.record_date) -
        new Date(a.meterRecord.record_date)
      );
    });
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลบิลได้',
      type: 'error',
    });
  }
};

onMounted(async () => {
  await fetchResidence();
  await fetchBills();
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
        { name: 'ระบบจัดการบิล' },
      ]"
    />
    <back :to="{ name: 'dashboard', params: { residenceId } }" />
    <div class="grid grid-cols-1">
      <div class="bg-white p-10 mt-2 shadow rounded-lg border">
        <div class="flex justify-between">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            ระบบจัดการบิล
          </h1>
          <router-link
            :to="{
              name: 'create-bill',
              params: {
                residenceId,
              },
            }"
          >
            <Button btnType="primary">สร้างบิลใหม่</Button>
          </router-link>
        </div>
        <p class="mt-5" v-if="!bills.length">
          ไม่มีบิลในระบบ กรุณาสร้างบิลใหม่
        </p>

        <BillListTable
          :isLoading="isLoading"
          :bills="bills"
          :residence-id="residenceId"
          @refetch="fetchBills"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
