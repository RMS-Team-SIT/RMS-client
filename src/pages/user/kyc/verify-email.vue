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
const currentStep = 1;
const userStore = useUserStore();
const { notify } = useNotification();
const currentUser = ref(userStore.getUser);
const disableResendEmail = ref(false);
const resendEmail = async () => {
  try {
    isLoading.value = true;
    disableResendEmail.value = true;
    await UserServices.resendVerifyEmail(currentUser.value._id);
    notify({
      type: 'success',
      title: 'สำเร็จ',
      text: 'ส่งอีเมลยืนยันอีกครั้งสำเร็จ',
      group: 'tr',
    });
    setTimeout(() => {
      disableResendEmail.value = false;
    }, 60000);
    isLoading.value = false;
  } catch (error) {
    notify({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถส่งอีเมลยืนยันอีกครั้งได้',
      group: 'tr',
    });
  }
};

const checkCurrentStep = async () => {};

onBeforeMount(async () => {
  await checkCurrentStep();
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
            { name: 'ยืนยันตัวตน', pathName: 'manage' },
          ]"
        />
      </div>
      <Steps
        :stepList="['ยืนยันอีเมลของคุณ', 'เงื่อนไขข้อตกลง' ,'ยืนยันตัวตน', 'รอการอนุมัติ']"
        :currentStep="1"
      />

      <!-- Step 1 -->
      <div
        class="relative bg-white p-10 space-y-4 rounded border border-gray-200"
      >
        <h1 class="text-xl font-semibold text-dark-blue-200">
          กรุณายืนยันอีเมลของคุณเพื่อดำเนินการต่อ
        </h1>
        <p class="text-base">
          เราได้ทำการส่งลิ้งค์การยืนยันอีเมล ไปที่อีเมล :
          {{ currentUser.email }}
        </p>
        <p class="text-base">
          หากคุณไม่ได้รับอีเมล กรุณากดปุ่มด้านล่างเพื่อส่งอีเมลยืนยันอีกครั้ง
        </p>
        <Button
          class=""
          type="primary"
          @click="resendEmail"
          :disabled="disableResendEmail"
        >
          ส่งอีเมลยืนยันอีกครั้ง
          <span v-if="isLoading" class="loading loading-dots loading-xs"></span>
        </Button>
        <p class="text-sm text-red-500" v-if="disableResendEmail">กรุณารอ 60 เพื่อส่งอีกครั้ง</p>
        <p>* หากทำการยืนยันอีเมลแล้ว กรุณารีเฟรชหน้านี้</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
