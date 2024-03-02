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

// const confirmPageReload = (event) => {
//   // Display confirmation dialog only if there are unsaved changes
//   const hasUnsavedChanges = true; // Replace this with your logic to check for unsaved changes
//   if (hasUnsavedChanges) {
//     const confirmationMessage =
//       'คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้ ความก้าวหน้าของคุณจะหายไป';
//     event.returnValue = confirmationMessage; // For older browsers
//     return confirmationMessage; // For modern browsers
//   }
// };

// window.addEventListener('beforeunload', confirmPageReload);

// onBeforeUnmount(() => {
//   window.removeEventListener('beforeunload', confirmPageReload);
// });

const router = useRouter();
const { notify } = useNotification();
const route = useRoute();

const stepList = [
  'ข้อมูลหอพัก',
  'อัปโหลดเอกสาร',
  'กำหนดค่าบริการเพิ่มเติม',
  'ช่องทางการชำระเงิน',
  'ประเภทห้องพัก',
  'แผนผังห้องพัก',
  'สร้างห้องพัก',
  'ตรวจสอบข้อมูล',
  'สถานะการอนุมัติ',
];
const numberOfSteps = stepList.length;

const currentStep = ref(1);
const canNexts = ref(new Array(numberOfSteps).fill(false));
const userStore = useUserStore();
const user = userStore.getUser;

const residenceData = reactive({
  name: '',
  description: '',
  address: '',
  images: [],
  contact: {
    contactName: user.fullname,
    facebook: '',
    line: '',
    phone: user.phone,
    email: user.email,
  },
  facilities: [],
  fees: [],
  payments: [],
  paymentNotes: '',
  roomTypes: [],
  rooms: [],
  numberOfFloor: 1,
  numberOfRoomEachFloor: [],
  roomRentalPrice: 0,
  defaultWaterPriceRate: '',
  defaultElectricPriceRate: '',
  imageFiles: [],
  residenceBusinessLicense: { fileName: null, file: null, isEdited: false },
});

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
};

const getChildData = (data) => {
  for (const key in data) {
    residenceData[key] = data[key];
  }
};

const submitData = async () => {
  // Upload images if imageFiles not empty
  if (residenceData.imageFiles.length) {
    const response = await FileService.uploadImages(residenceData.imageFiles);
    if (response.status == 201) {
      const data = await response.json();
      Array.from(data.files).forEach((file) => {
        residenceData.images.push(file.fileName);
      });
    } else {
      const data = await response.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'Failed to upload images ' + data?.message,
        type: 'error',
      });
      return;
    }
  }
  const response = await ResidenceServices.createResidence(residenceData);
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'สร้างหอพักสำเร็จแล้ว',
      type: 'success',
    });
    router.push({ name: 'manage' });
  } else {
    const data = await response.json();
    console.log(data);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถสร้างหอพักได้. ' + data?.message,
      type: 'error',
    });
  }
};

watch(residenceData, () => {
  console.log('residenceData', residenceData);
  updateCanNext();
});

const updateCanNext = () => {
  canNexts.value[0] = !!(
    residenceData.name &&
    residenceData.address &&
    residenceData.contact.phone &&
    residenceData.contact.contactName &&
    residenceData.contact.email
  );
  canNexts.value[1] = !!residenceData.residenceBusinessLicense.file;
  canNexts.value[2] =
    !!residenceData.defaultElectricPriceRate &&
    !!residenceData.defaultWaterPriceRate;
  canNexts.value[3] = !!residenceData.payments.length;
  canNexts.value[4] = !!residenceData.roomTypes.length;
  canNexts.value[5] =
    !!residenceData.numberOfFloor &&
    residenceData.numberOfRoomEachFloor.length > 0 &&
    residenceData.numberOfFloor ===
      residenceData.numberOfRoomEachFloor.length &&
    residenceData.numberOfRoomEachFloor.every(
      (numberOfRoom) => numberOfRoom > 0
    );
  canNexts.value[6] =
    !!residenceData.rooms.length &&
    !!residenceData.rooms.every((room) => room.type);
};

onMounted(async () => {
  await fetchFacility();
  await fetchBanks();
  updateCanNext();
});
</script>

<template>
  <div class="card w-full">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'หน้าแรก', pathName: 'home' },
            { name: 'จัดการ', pathName: 'manage' },
            { name: 'สร้างหอพัก', pathName: 'create-residence' },
          ]"
        />
      </div>
      {{ canNexts }} <br />
      {{ residenceData }}

      <div class="grid grid-cols-12">
        <div class="p-4 mb-4 card bg-white col-span-3">
          <Steps
            class="steps-vertical text-left"
            :stepList="stepList"
            :currentStep="currentStep"
          />
        </div>

        <div class="p-4 mb-4 card bg-white col-span-9">
          <!-- step 1 -->
          <div v-if="currentStep == 1">
            <ResidenceBasicInfoForm
              @getData="getChildData"
              :residenceData="residenceData"
            />

            <div
              class="relative bg-white p-10 space-y-4 shadow-md rounded basis-full"
            >
              <h1 class="text-xl font-semibold text-dark-blue-200">
                อัปโหลดรูปภาพของหอพัก
              </h1>
              <p class="text-sm mt-5">
                กรุณาอัปโหลดรูปภาพของหอพัก เช่น ภาพถ่ายหอพัก
                เพื่อใช้ในการแสดงผลหอพัก
              </p>
              <ImageUploadForm
                @getImageFiles="getChildData"
                :imageFiles="residenceData?.imageFiles"
              />
            </div>

            <ResidenceContactForm
              @getData="getChildData"
              :residenceData="residenceData"
            />

            <ResidenceFacilityForm
              @getData="getChildData"
              :residenceData="residenceData"
              :facility-list="availableFacility"
            />
          </div>

          <!-- step 2 -->
          <div v-if="currentStep == 2">
            <!-- File upload -->
            <div class="relative bg-white p-10 shadow-md rounded basis-full">
              <h1 class="text-xl font-semibold text-dark-blue-200">
                อัปโหลดเอกสารประกอบการหอพัก
              </h1>
              <p class="text-sm mt-5">
                กรุณาอัปโหลดเอกสารประกอบการหอพัก
                เพื่อใช้ในการตรวจสอบและการยืนยันข้อมูลของหอพัก
              </p>
              <div class="mt-5">
                <label class="label">
                  <span class="text-base label-text"
                    >เอกสารประกอบการหอพัก
                    <span class="text-red-500">* (pdf เท่านั้น)</span>
                  </span>
                </label>
                <input
                  v-if="!viewOnly"
                  type="file"
                  @change="
                    (e) =>
                      (residenceData.residenceBusinessLicense.file =
                        e.target.files[0])
                  "
                  class="file-input-sm file-input file-input-bordered bg-white w-full max-w-xs file-input-ghost"
                />
                <!-- Preview file name if exist -->
                <div
                  v-if="
                    residenceData.residenceBusinessLicense?.file ||
                    residenceData.residenceBusinessLicense?.fileName
                  "
                  class="mt-5"
                >
                  <span class="text-sm text-gray-500">
                    {{
                      residenceData.residenceBusinessLicense.file?.name ||
                      residenceData.renterFiles.residenceBusinessLicense
                        ?.fileName
                    }}
                    <Button btn-type="ghost" class="font-xs" v-if="!viewOnly"
                      >ลบไฟล์</Button
                    >
                  </span>
                </div>
                <div v-else>
                  <span class="text-sm text-gray-500 mt-5"
                    >ยังไม่มีไฟล์ที่ถูกเลือก</span
                  >
                </div>
              </div>
            </div>
            <!-- end -->
          </div>

          <!-- step 3 -->
          <div v-if="currentStep == 3">
            <ResidenceSettingForm
              @getData="getChildData"
              :residenceData="residenceData"
            />
            <ResidenceFeeForm
              @getData="getChildData"
              :residenceData="residenceData"
            />
          </div>

          <!-- step 4 -->
          <div v-if="currentStep == 4">
            <PaymentForm
              @getData="getChildData"
              :residenceData="residenceData"
              :banks="banks"
            />
          </div>

          <!-- step 5 -->
          <div v-if="currentStep == 5">
            <ResidenceRoomTypeForm
              @getData="getChildData"
              :residenceData="residenceData"
              :banks="banks"
            />
          </div>

          <!-- step 6 -->
          <div v-if="currentStep == 6">
            <RoomCreateManyForm
              @getData="getChildData"
              :payload="residenceData"
            />
          </div>

          <!-- step 7 -->
          <div v-if="currentStep == 7">
            <ResidenceRoomMapForm
              @getData="getChildData"
              :residenceData="residenceData"
            />
          </div>

          <!-- button control -->

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
              v-if="currentStep == numberOfSteps"
              @click="submitData"
              class="rounded-badge"
              btnType="primary"
            >
              บันทึกข้อมูล
            </Button>
            <Button
              @click="changeStep('next')"
              class="rounded-badge"
              v-else
              :disabled="!canNexts[currentStep - 1]"
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
