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
import ImageUploadForm from '@/components/form/image.form.vue';
import FacilityService from '@/services/FacilityService';
import ResidenceFeeForm from '@/components/residence/form/residence.fee.form.vue';
import BankService from '@/services/BankService';
import PaymentForm from '@/components/payment/form/payment.form.vue';
import ResidenceRoomTypeForm from '@/components/residence/form/residence.room-type.form.vue';
import RoomCreateManyForm from '@/components/room/form/room.create-many.form.vue';
import ResidenceRoomMapForm from '@/components/residence/form/residence.room-map.form.vue';
import Loading from '@/components/common/loading.vue';
import FileService from '@/services/FileService';
import ResidencePendingText from '@/components/residence/form/residence.pending-text.vue';

const router = useRouter();
const { notify } = useNotification();
const route = useRoute();

const stepList = ['ข้อมูลหอพัก', 'สถานะการอนุมัติ'];
const currentStep = ref(1);
const numberOfSteps = stepList.length;
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const residenceData = reactive({
  name: '',
  description: '',
  address: '',
  images: [],
  contact: {
    contactName: '',
    facebook: '',
    line: '',
    phone: '',
    email: '',
  },
  facilities: [],
  fees: [],
  payments: [],
  paymentNotes: '',
  roomTypes: [],
  rooms: [],
  numberOfFloor: 1,
  numberOfRoomEachFloor: [],
  defaultWaterPriceRate: '',
  defaultElectricPriceRate: '',
  residenceBusinessLicense: '',
});

const fetchPendingResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    const data = await response.json();
    console.log('residence', data);
    residenceData.name = data.name;
    residenceData.description = data.description;
    residenceData.address = data.address;
    residenceData.images = data.images.map((imageName) => {
      return FileService.getFile(imageName);
    });
    residenceData.contact.contactName = data.contact.contactName;
    residenceData.contact.facebook = data.contact.facebook;
    residenceData.contact.line = data.contact.line;
    residenceData.contact.phone = data.contact.phone;
    residenceData.contact.email = data.contact.email;
    residenceData.facilities = data.facilities.map((facility) => facility._id);
    residenceData.fees = data.fees;
    residenceData.payments = data.payments.map((payment) => ({
      bankId: payment.bank._id,
      ...payment,
    }));
    residenceData.paymentNotes = data.paymentNotes;
    residenceData.roomTypes = data.roomTypes;
    residenceData.rooms = data.rooms.map((room) => ({
      ...room,
      type: room.type._id,
    }));
    residenceData.defaultWaterPriceRate = data.defaultWaterPriceRate;
    residenceData.defaultElectricPriceRate = data.defaultElectricPriceRate;
    residenceData.residenceBusinessLicense = data.residenceBusinessLicense;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
  }
};

const banks = ref([]);
const fetchBanks = async () => {
  const response = await BankService.fetchBanks();
  if (response.status === 200) {
    let result = await response.json();
    console.log('banks', result);
    banks.value = result;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch banks data',
      type: 'error',
    });
  }
};

const availableFacility = ref([]);
const fetchFacility = async () => {
  const response = await FacilityService.fetchFacilities();
  if (response.status == 200) {
    const data = await response.json();
    console.log('facility', data);
    availableFacility.value = data;
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลสิ่งอำนวยความสะดวกได้ ' + data?.message,
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
  window.scrollTo(0, 0);
};

onMounted(async () => {
  await fetchFacility();
  await fetchBanks();
  await fetchPendingResidence();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="card w-full" v-else>
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
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
          <div v-if="currentStep == 1">
            <ResidenceBasicInfoForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ImagePreview
              :imageUrls="residenceData.images"
              preview-from="url"
            />
            <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
              <h1 class="text-xl font-semibold text-dark-blue-200">
                เอกสารประกอบการหอพัก
              </h1>
              <p class="flex gap-2">
                ใบประกอบการหอพัก :
                <router-link
                  target="_blank"
                  class="flex items-center gap-2 underline text-light-red"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: residenceData.residenceBusinessLicense,
                    },
                  }"
                >
                  ดูไฟล์ <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </router-link>
              </p>
            </div>

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
            <ResidenceRoomMapForm
              :residenceData="residenceData"
              :viewOnly="true"
            />
          </div>
          <div v-else>
            <ResidencePendingText />
          </div>

          <div class="flex justify-end gap-2 mt-10">
            <Button
              btn-type="secondary"
              @click="changeStep('back')"
              v-if="currentStep > 1"
              class="rounded-badge"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              ย้อนกลับ
            </Button>
            <Button
              @click="changeStep('next')"
              class="rounded-badge"
              v-else
            >
              ถัดไป
              <ArrowRightIcon class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
