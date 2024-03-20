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
import { useRouter } from 'vue-router';
import { validateIdcardNumber } from '@/utils/idcard';

const isLoading = ref(true);
const currentStep = 3;
const userStore = useUserStore();
const { notify } = useNotification();
const currentUser = ref(userStore.getUser);
const disableUploadIdcard = ref(false);
const router = useRouter();

const idCardData = reactive({
  idCardNumber: null,
  idCardImage: null,
});

const uploadIdcard = async () => {
  try {
    isLoading.value = true;
    disableUploadIdcard.value = true;

    if (!validateIdcardNumber(idCardData.idCardNumber)) {
      notify({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'เลขบัตรประจำตัวประชาชนไม่ถูกต้อง',
        group: 'tr',
      });
      disableUploadIdcard.value = false;
      isLoading.value = false;
      return;
    }

    const response = await UserServices.uploadIdCard(
      currentUser.value._id,
      idCardData
    );
    if (response.status === 200) {
      notify({
        type: 'success',
        title: 'สำเร็จ',
        text: 'ยืนยันตัวตนสำเร็จ',
        group: 'tr',
      });
      router.push({ name: 'kyc-approval-status' });
    } else {
      notify({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันตัวตนได้ โปรดลองใหม่อีกครั้ง',
        group: 'tr',
      });
      disableUploadIdcard.value = false;
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    notify({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: '',
      group: 'tr',
    });
  }
};

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
            { name: 'ยืนยันตัวตน', pathName: 'manage' },
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
        <h1 class="text-xl font-semibold text-dark-blue-200">
          กรุณายืนยันตัวตนของคุณเพื่อดำเนินการต่อ
        </h1>
        <p class="text-base mt-10">
          กรุณายืนยันตัวตนของคุณโดยการ ป้อนข้อมูลบัตรประชาชนของคุณ
        </p>
        <div>
          <label class="label">
            <span class="text-base label-text">เลขบัตรประจำตัวประชาชน</span>
          </label>
          <input
            name="idCardNumber"
            type="text"
            placeholder="ใส่เลขบัตรประจำตัวประชาชน"
            class="input input-bordered bg-white input-sm rounded-sm"
            v-model="idCardData.idCardNumber"
            required
          />
        </div>

        <Button
          type="primary"
          @click="uploadIdcard"
          :disabled="disableUploadIdcard"
        >
          ยืนยันตัวตน
          <span v-if="isLoading" class="loading loading-dots loading-xs"></span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
