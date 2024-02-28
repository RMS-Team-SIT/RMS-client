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

const isLoading = ref(true);
const currentStep = 2;
const userStore = useUserStore();
const { notify } = useNotification();
const currentUser = ref(userStore.getUser);
const disableAcceptPolicy = ref(false);
const router = useRouter();

const acceptPolicy = async () => {
  try {
    isLoading.value = true;
    disableAcceptPolicy.value = true;
    const response = await UserServices.acceptPolicy(currentUser.value._id);
    if (response.status === 200) {
      notify({
        type: 'success',
        title: 'สำเร็จ',
        text: 'ยอมรับเงื่อนไขข้อตกลงการใช้งานสำเร็จ',
        group: 'tr',
      });
      router.push({ name: 'kyc-id-card' });
    } else {
      notify({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยอมรับเงื่อนไขข้อตกลงการใช้งานได้ โปรดลองใหม่อีกครั้ง',
        group: 'tr',
      });
      disableAcceptPolicy.value = false;
    }
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

      <!-- Step 1 -->
      <div
        class="relative bg-white p-10 space-y-4 rounded border border-gray-200"
      >
        <h1 class="text-xl font-semibold text-dark-blue-200">
          เงื่อนไขข้อตกลงในการใช้บริการ
        </h1>
        <p class="text-base">
          การเข้าเว็บไซต์นี้ ตลอดจนการเปิดหน้าเว็บต่าง ๆ ที่อยู่ในเว็บไซต์นี้
          ผู้ใช้งานเว็บไซต์ (“ผู้ใช้งาน”)
          ตกลงและยินยอมที่จะปฏิบัติตามนโยบายของบริษัท RMS กฎหมายที่ใช้บังคับ
          และข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์ที่กำหนดไว้ในข้อตกลงนี้ทั้งที่กำหนดไว้เป็นการทั่วไปและที่ได้กำหนดไว้โดยเฉพาะเจาะจงในส่วนใดส่วนหนึ่งของเว็บไซต์นี้ทั้งหมด
          (“ข้อตกลงและเงื่อนไขการใช้”)
          โดยผู้ใช้งานรับทราบและตกลงว่าข้อตกลงและเงื่อนไขการใช้ที่กำหนดไว้นั้นอาจมีการเปลี่ยนแปลงได้โดยไม่ต้องมีการบอกกล่าวล่วงหน้า
          <br />
          <br />
          อย่างไรก็ดี การเปลี่ยนแปลงใด ๆ
          ที่เกี่ยวกับข้อตกลงและเงื่อนไขการใช้จะมีการเผยแพร่ไว้ในเว็บไซต์นี้
          และเมื่อผู้ใช้งานได้เข้าใช้งานเว็บไซต์นี้ภายหลังการเปลี่ยนแปลงดังกล่าวแล้ว
          ย่อมถือว่าผู้ใช้งานตกลงยอมรับข้อตกลงและเงื่อนไขการใช้ทั้งหมดตามที่ได้เปลี่ยนแปลงแล้ว
          ดังนั้น
          ผู้ใช้งานจึงควรติดตามข้อตกลงและเงื่อนไขการใช้งานเว็บไซต์ที่กำหนดไว้นี้อยู่เสมอ
          <br /><br />
          ทั้งนี้
          หากท่านไม่เห็นด้วยหรือประสงค์ที่จะปฏิเสธความมีผลผูกพันตามข้อตกลงและเงื่อนไขการใช้ใด
          ๆ ขอความกรุณาท่านยุติการเข้าชมและใช้งานเว็บไซต์นี้
        </p>
        <p class="text-base mt-10">
          หากท่านยอมรับเงื่อนไขข้อตกลงการใช้งาน
          โปรดกดปุ่มยอมรับเงื่อนไขข้อตกลงการใช้งาน
        </p>
        <Button
          class=""
          type="primary"
          @click="acceptPolicy"
          :disabled="disableAcceptPolicy"
        >
          ยอมรับเงื่อนไขข้อตกลงการใช้งาน

          <span v-if="isLoading" class="loading loading-dots loading-xs"></span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
