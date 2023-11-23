<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
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
import { createResident, fetchResident } from '@/services/residentServices';
import Loading from '@/components/common/loading.vue';

const router = useRouter();
const route = useRoute();

const residentId = route.params.id;
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await fetchResident(residentId);
    console.log(response);
    if (response.status === 200) {
      let result = await response.json();
      residentData.data = result;
    } else {
      alert('Failed to fetch residents');
    }
    console.log(residentData.data);
  } finally {
    isLoading.value = false;
  }
});

const numberOfSteps = 3;
const currentStep = ref(1);

const residentData = reactive({
  data: {
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
  },
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
    residentData.data[key] = data[key];
  }
};

const submitData = async () => {
  const response = await createResident(residentData);
  console.log(response);
  if (response.status == 201) {
    alert('Resident created successfully');
    router.push({ name: 'manage' });
  } else {
    alert('Failed to create resident');
  }
};
</script>

<template>
  <div class="card w-full glass">
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <Loading />
    </div>
    <div v-else class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Update Resident' },
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
            :residentData="residentData.data"
          />
          <ResidentContactForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData.data"
          />
          <ResidentSettingForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData.data"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4">
          <ResidentImagesForm
            class="basis-full"
            @getData="getChildData"
            :residentData="residentData.data"
          />
        </div>

        <!-- step 3 -->
        <div v-if="currentStep == 3" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <ResidentBasicInfoForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData.data"
              :viewOnly="true"
            />
            <ResidentContactForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData.data"
              :viewOnly="true"
            />
            <ResidentSettingForm
              class="basis-1/3"
              @getData="getChildData"
              :residentData="residentData.data"
              :viewOnly="true"
            />
          </div>
          <ImagePreview class="basis-full" :images="residentData.data.images" />
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
