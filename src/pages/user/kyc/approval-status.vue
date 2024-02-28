<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import ResidenceCard from '@/components/residence/residence.card.vue';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Steps from '@/components/common/steps.vue';
import { useUserStore } from '@/stores/user.store';
import UserServices from '@/services/UserServices';

const isLoading = ref(true);
const currentStep = 4;
const userStore = useUserStore();
const { notify } = useNotification();
const currentUser = ref(userStore.getUser);
const disableUploadIdcard = ref(false);

onBeforeMount(async () => {
  isLoading.value = false;
});
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
        :stepList="[
          'ยืนยันอีเมลของคุณ',
          'เงื่อนไขข้อตกลงการใช้งาน',
          'ยืนยันตัวตน',
          'รอการอนุมัติ',
        ]"
        :currentStep="currentStep"
      />

      <div
        class="relative bg-white p-10 space-y-4 rounded border border-gray-200"
      >
        <h1 class="text-xl font-semibold text-dark-blue-200">ระบบกำลังตรวจสอบข้อมูลของคุณ</h1>
        <p class="text-base mt-10">
          ขอบคุณที่ยืนยันตัวตนของคุณ ระบบกำลังตรวจสอบข้อมูลของคุณ <br />
          หากท่านผ่านการตรวจสอบ ท่านจะได้รับอีเมลแจ้งเตือน
          และสามารถใช้งานระบบได้ทันที

          <br /><br />
          หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม กรุณาติดต่อ support@rms.com
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
