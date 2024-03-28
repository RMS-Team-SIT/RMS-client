<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Loading from '@/components/common/loading.vue';
import PaymentListTable from '@/components/payment/payment.list.table.vue';
import Button from '@/components/common/button.vue';
import back from '@/components/common/back.vue';

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
        { name: 'ช่องทางการชำระเงิน' },
      ]"
    />

    <back :to="{ name: 'dashboard', params: { residenceId } }" />

    <div class="grid grid-cols-1">
      <div class="bg-white p-10 mt-2 shadow rounded-lg border">
        <div class="flex justify-between">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            ช่องทางการชำระเงิน
          </h1>
          <router-link
            :to="{
              name: 'create-payment',
              params: {
                residenceId,
              },
            }"
          >
            <Button btnType="primary">เพิ่มช่องทางการชำระเงิน</Button>
          </router-link>
        </div>
        <PaymentListTable
          :residenceId="residenceId"
          :payments="residence.data.payments"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
