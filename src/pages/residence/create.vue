<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ResidenceBasicInfoForm from '@/components/residence/form/residence.basic.info.form.vue';
import ResidenceContactForm from '@/components/residence/form/residence.contact.form.vue';
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import ImageUploadForm from '@/components/form/image.form.vue';

const router = useRouter();
const route = useRoute();
const numberOfSteps = 3;
const currentStep = ref(1);
const { notify } = useNotification();

const residenceData = reactive({
  name: '',
  description: '',
  address: '',
  images: [],
  contact: {
    facebook: '',
    line: '',
    phone: '',
    email: '',
  },
  defaultWaterPriceRate: 0.0,
  defaultLightPriceRate: 0.0,
  imageFiles: [],
});

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
      text: 'Residence created successfully',
      type: 'success',
    });
    router.push({ name: 'manage' });
  } else {
    const data = await response.json();
    console.log(data);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to create residence. ' + data?.message,
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="card w-full ">
    <div class="card-body px-10 md:px-40 ">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Create Residence', pathName: 'create-residence' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="[
              'Residence Infomation',
              'Residence Images',
              'Review Information',
            ]"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <ResidenceBasicInfoForm
            @getData="getChildData"
            :residenceData="residenceData"
          />
          <ResidenceContactForm
            @getData="getChildData"
            :residenceData="residenceData"
          />
          <ResidenceSettingForm
            @getData="getChildData"
            :residenceData="residenceData"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4">
          <div class="relative bg-white p-10 space-y-4 shadow-md rounded basis-full">
            <h1 class="text-xl font-semibold text-dark-blue-200">
              Residence Images
            </h1>
            <p class="text-xs">Please upload your residence images.</p>
            <ImageUploadForm
              @getImageFiles="getChildData"
              :imageFiles="residenceData.imageFiles"
            />
          </div>
        </div>

        <!-- step 3 -->
        <div v-if="currentStep == 3" class="flex gap-4 flex-col">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <ResidenceBasicInfoForm
              @getData="getChildData"
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ResidenceContactForm
              @getData="getChildData"
              :residenceData="residenceData"
              :viewOnly="true"
            />
            <ResidenceSettingForm
              @getData="getChildData"
              :residenceData="residenceData"
              :viewOnly="true"
            />
          </div>
          <ImagePreview
            class="basis-full"
            :imageFiles="residenceData.imageFiles"
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
            Back
          </Button>
          <Button
            v-if="currentStep == numberOfSteps"
            @click="submitData"
            class="rounded-badge"
            btnType="primary"
          >
            Submit
          </Button>
          <Button @click="changeStep('next')" class="rounded-badge" v-else>
            Next Step
            <ArrowRightIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>