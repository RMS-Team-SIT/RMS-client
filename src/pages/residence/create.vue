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

const router = useRouter();
const { notify } = useNotification();
const route = useRoute();

const stepList = [
  'ข้อมูลหอพัก',
  'อัปโหลดเอกสารของหอพัก',
  'กำหนดค่าบริการต่าง ๆ',
  'สร้างรูปแบบห้องพัก',
  'กำหนดค่าบริการต่าง ๆ',
  'สร้างห้องพัก',
  'เพิ่มช่องทางการชำระเงิน',
  'ตรวจสอบข้อมูล',
  'สถานะการสร้าง',
];
const numberOfSteps = stepList.length;

const currentStep = ref(1);
const canNext = ref(new Array(numberOfSteps).fill(true));
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
  facility: [],
  fee: [],
  defaultWaterPriceRate: 0.0,
  defaultElectricPriceRate: 0.0,
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
  // canNext.value =
  //   residenceData.name &&
  //   residenceData.defaultElectricPriceRate &&
  //   residenceData.defaultElectricPriceRate > 0 &&
  //   residenceData.defaultWaterPriceRate &&
  //   residenceData.defaultWaterPriceRate > 0;
});

onMounted(async () => {
  await fetchFacility();
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
          <div v-if="currentStep == 1" class="w-full">
            <ResidenceBasicInfoForm
              @getData="getChildData"
              :residenceData="residenceData"
            />

            <div
              class="relative bg-white p-10 space-y-4 shadow-md rounded basis-full"
            >
              <h1 class="text-xl font-semibold text-dark-blue-200">
                อัพโหลดรูปภาพของหอพัก
              </h1>
              <p class="text-sm mt-5">
                กรุณาอัพโหลดรูปภาพของหอพัก เช่น ภาพถ่ายหอพัก
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
          <div v-if="currentStep == 2" class="flex gap-4">
            <!-- File upload -->
            <div class="relative bg-white p-10 shadow-md rounded basis-full">
              <h1 class="text-xl font-semibold text-dark-blue-200">
                อัพโหลดเอกสารประกอบการหอพัก
              </h1>
              <p class="text-sm mt-5">
                กรุณาอัพโหลดเอกสารประกอบการหอพัก
                เพื่อใช้ในการตรวจสอบและการยืนยันข้อมูลของหอพัก
              </p>
              <div class="mt-5">
                <label class="label">
                  <span class="text-base label-text"
                    >เอกสารประกอบการหอพัก
                    <span class="text-red-500">(pdf เท่านั้น)</span>
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
          <div v-if="currentStep == 3" class="flex gap-4 flex-col">
            <ResidenceFeeForm
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
              :disabled="!canNext[currentStep - 1]"
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
