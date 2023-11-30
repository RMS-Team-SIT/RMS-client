<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ResidentBasicInfoForm from '@/components/resident/form/resident.basic.info.form.vue';
import ResidentContactForm from '@/components/resident/form/resident.contact.form.vue';
import ResidentSettingForm from '@/components/resident/form/resident.setting.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';
import FileService from '@/services/FileService';
import ImageUploadForm from '@/components/form/image.form.vue';

const router = useRouter();
const route = useRoute();
const numberOfSteps = 3;
const currentStep = ref(1);
const { notify } = useNotification();

const residentData = reactive({
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
  console.log('Received data from child', data);
  for (const key in data) {
    residentData[key] = data[key];
  }
};

const submitData = async () => {
  // Upload images if imageFiles not empty
  if (residentData.imageFiles.length) {
    const response = await FileService.uploadImages(residentData.imageFiles);
    if (response.status == 201) {
      const data = await response.json();
      Array.from(data.files).forEach((file) => {
        residentData.images.push(file.fileName);
      });
    } else {
      const data = await response.json();
      console.log(data);
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to upload images ' + data?.message,
        type: 'error',
      });
      return;
    }
  }
  const response = await ResidentServices.createResident(residentData);
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Resident created successfully',
      type: 'success',
    });
    router.push({ name: 'manage' });
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to create resident',
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Create Resident', pathName: 'create-resident' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="[
              'Resident Infomation',
              'Resident Images',
              'Review Information',
            ]"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-4">
          <ResidentBasicInfoForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData"
          />
          <ResidentContactForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData"
          />
          <ResidentSettingForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4">
          <!-- <ResidentImagesForm
            class="basis-full"
            @getData="getChildData"
            :residentData="residentData"
          /> -->
          <div class="relative bg-white p-10 space-y-4 shadow-md rounded basis-full">
            <h1 class="text-3xl font-semibold text-dark-blue-200">
              Resident Images
            </h1>
            <p class="text-xs">Please upload your resident images.</p>
            <ImageUploadForm
              @getImageFiles="getChildData"
              :imageFiles="residentData.imageFiles"
            />
          </div>
        </div>

        <!-- step 3 -->
        <div v-if="currentStep == 3" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <ResidentBasicInfoForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData"
              :viewOnly="true"
            />
            <ResidentContactForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData"
              :viewOnly="true"
            />
            <ResidentSettingForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData"
              :viewOnly="true"
            />
          </div>
          <ImagePreview
            class="basis-full"
            :imageFiles="residentData.imageFiles"
          />
          <ImageUploadForm
              @getImages="getChildData"
              :imagePreviews="residentData.imagePreviews"
              :imageFiles="residentData.imageFiles"
              :viewOnly="true"
            />
        </div>

        <!-- button control -->
        <div class="flex justify-center gap-2 mt-10">
          <Button
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
            btnType="secondary"
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
