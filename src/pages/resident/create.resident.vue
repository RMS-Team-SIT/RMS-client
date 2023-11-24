<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ResidentBasicInfoForm from '@/components/resident/form/resident.basic.info.form.vue';
import ResidentContactForm from '@/components/resident/form/resident.contact.form.vue';
import ResidentSettingForm from '@/components/resident/form/resident.setting.form.vue';
import ResidentImagesForm from '@/components/resident/form/resident.images.form.vue';
import Button from '@/components/common/button.vue';
import ResidentSummarizeForm from '@/components/resident/form/resident.summarize.form.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { createResident } from '@/services/residentServices';
import { useNotification } from '@kyvg/vue3-notification';

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
  rooms: [],
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
  const response = await createResident(residentData);
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
      {{ residentData.images.length }}
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
          <ResidentImagesForm
            class="basis-full"
            @getData="getChildData"
            :residentData="residentData"
          />
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
          <ImagePreview class="basis-full" :images="residentData.images" />
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
