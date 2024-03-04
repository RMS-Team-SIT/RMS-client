<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ResidenceBasicInfoForm from '@/components/residence/form/residence.basic.info.form.vue';
import ResidenceContactForm from '@/components/residence/form/residence.contact.form.vue';
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';
import ResidenceFacilityForm from '@/components/residence/form/residence.facility.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import ImageUploadForm from '@/components/form/image.form.vue';
import { useUserStore } from '@/stores/user.store';
import FacilityService from '@/services/FacilityService';
import ResidenceFeeForm from '@/components/residence/form/residence.fee.form.vue';
import { onBeforeUnmount } from 'vue';
import BankService from '@/services/BankService';
import PaymentForm from '@/components/payment/form/payment.form.vue';
import ResidenceRoomTypeForm from '@/components/residence/form/residence.room-type.form.vue';
import RoomCreateManyForm from '@/components/room/form/room.create-many.form.vue';
import ResidenceRoomMapForm from '@/components/residence/form/residence.room-map.form.vue';
import { validatePDFFile } from '@/utils/file';

const router = useRouter();
const { notify } = useNotification();
const route = useRoute();

const stepList = ['ข้อมูลหอพัก'];

const userStore = useUserStore();
const user = userStore.getUser;
const residenceId = route.params.residenceId;

const residenceData = ref(null);

const fetchPendingResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    const data = await response.json();
    console.log('residenceData', data);
    residenceData.value = data;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
  }
};

const changeStep = (action) => {
  switch (action) {
    case 'next':
      currentStep.value = Math.min(currentStep.value + 1, numberOfSteps);
      break;
    case 'back':
      currentStep.value = Math.max(currentStep.value - 1, 1);
      break;
    default:
      console.warn('Invalid action');
      break;
  }
  // goto top of the page
  window.scrollTo(0, 0);

  // submit
  if (currentStep.value === 9) {
    submitData();
  }
};

onMounted(async () => {
  await fetchPendingResidence();
  updateCanNext();
});
</script>

<template>
  <div class="card w-full">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        {{ residenceData }}

        <Breadcrumb
          :pathList="[
            { name: 'หน้าแรก', pathName: 'home' },
            { name: 'จัดการ', pathName: 'manage' },
            { name: 'ดูข้อมูลหอพักที่รอการอนุมัติ' },
          ]"
        />
      </div>

      <div class="grid grid-cols-12">
        <div class="p-4 mb-4 card bg-white col-span-3">
          <Steps
            class="steps-vertical text-left"
            :stepList="stepList"
            :currentStep="currentStep"
          />
        </div>

        <div class="p-4 mb-4 card bg-white col-span-9">
          <div>
            <div class="relative bg-white p-10 shadow-md rounded basis-full">
              <h1 class="text-xl font-semibold text-dark-blue-200">
                ข้อมูลหอพัก
              </h1>
            </div>

            <ResidenceBasicInfoForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ResidenceContactForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ResidenceFacilityForm
              :residenceData="residenceData"
              :facility-list="availableFacility"
              :viewOnly="true"
            />
            <ResidenceSettingForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ResidenceFeeForm :residenceData="residenceData" :viewOnly="true" />
            <PaymentForm
              :residenceData="residenceData"
              :banks="banks"
              :viewOnly="true"
            />
            <ResidenceRoomTypeForm
              :residenceData="residenceData"
              :banks="banks"
              :viewOnly="true"
            />
            <RoomCreateManyForm :payload="residenceData" :viewOnly="true" />
            <ResidenceRoomMapForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
          </div>

          <!-- step 9 -->
          <div>
            <div class="relative bg-white p-10 shadow-md rounded basis-full">
              <h1 class="text-xl font-semibold text-dark-blue-200">
                ระบบกำลังตรวจสอบข้อมูลของคุณ
              </h1>
              <p class="text-base mt-10">
                ขอบคุณที่สร้างหอพักในระบบของเรา เพื่อความปลอดภัยของผู้ใช้งาน
                <br />
                ระบบกำลังตรวจสอบข้อมูลหอพักที่คุณสร้าง
                <b>ท่านจะได้รับอีเมลแจ้งเตือน</b> หากหอพักของท่านผ่านการตรวจสอบ

                <br /><br />
                หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม กรุณาติดต่อ
                support@rms.com
              </p>
            </div>
          </div>

          <!-- button control -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
