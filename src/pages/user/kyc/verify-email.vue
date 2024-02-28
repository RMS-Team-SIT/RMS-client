<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import ResidenceCard from '@/components/residence/residence.card.vue';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Steps from '@/components/common/steps.vue';

const isLoading = ref(true);
const currentStep = 1;
const { notify } = useNotification();

onBeforeMount(async () => {});
</script>

<template>
  <div class="card w-full min-h-screen">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'หน้าแรก', pathName: 'home' },
            { name: 'KYC', pathName: 'manage' },
          ]"
        />
      </div>
      <Steps
        :stepList="['ยืนยันอีเมลของคุณ', 'กรอกข้อมูลเพิ่มเติม', 'รอการอนุมัติ']"
        :currentStep="1"
      />

      <div
        class="relative bg-white p-10 space-y-4 rounded border border-gray-200"
      >
        <h1 class="text-3xl font-semibold text-dark-blue-200">
          กรุณายืนยันอีเมลของคุณเพื่อดำเนินการต่อ
        </h1>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
