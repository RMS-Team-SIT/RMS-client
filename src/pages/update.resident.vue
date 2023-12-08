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
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const isLoading = ref(true);
const { notify } = useNotification();

onMounted(async () => {
  try {
    const response = await ResidentServices.fetchResident(residentId);
    if (response.status === 200) {
      let result = await response.json();
      residentData.data = result;
    } else {
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to fetch resident data',
        type: 'error',
      });
    }
  } catch (error) {
    console.error(error);
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch resident data',
      type: 'error',
    });
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
  for (const key in data) {
    residentData.data[key] = data[key];
  }
};

const submitData = async () => {
};
</script>

<template>
  <div class="card w-full glass">
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <Loading />
    </div>
    <div v-else class="card-body px-10 md:px-40 ">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Update Resident' },
            { name: residentId },
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
            Update
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