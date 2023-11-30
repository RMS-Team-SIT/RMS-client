<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';
import RentalInfoForm from '@/components/rental/form/rental.info.form.vue';
import RentalFilesForm from '@/components/rental/form/rental.files.form.vue';
import FileService from '@/services/FileService';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();

const rentalData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  image: null,
  copyOfIdCard: null,
  rentalContract: null,
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
    rentalData[key] = data[key];
  }
};

const submitData = async () => {
  // Upload files
  if (rentalData.copyOfIdCard) {
    // upload file
    const uploadFileResponse = await FileService.uploadPdf(
      rentalData.copyOfIdCard
    );
    if (uploadFileResponse.status != 201) {
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to upload files',
        type: 'error',
      });
      return;
    } else {
      const data = await uploadFileResponse.json();
      rentalData.copyOfIdCard = data.fileName;
    }
  }

  if (rentalData.rentalContract) {
    // upload file
    const uploadFileResponse = await FileService.uploadPdf(
      rentalData.rentalContract
    );
    if (uploadFileResponse.status != 201) {
      const data = await response.json();
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to upload files, '+ data?.message,
        type: 'error',
      });
      return;
    } else {
      const data = await uploadFileResponse.json();
      rentalData.rentalContract = data.fileName;
    }
  }

  const response = await ResidentServices.createRental(residentId, rentalData);
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Rental created successfully',
      type: 'success',
    });
    router.push({ name: 'manage-resident', params: { residentId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to create Rental: ' + data?.message,
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
            {
              name: 'Resident',
              pathName: 'manage-resident',
              params: { residentId },
            },
            { name: 'Create Rental' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="['Rental Infomation', 'Review Rental']"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-4">
          <RentalInfoForm
            class="basis-1/2"
            @getData="getChildData"
            :rentalData="rentalData"
          />
          <RentalFilesForm
            class="basis-1/2"
            @getData="getChildData"
            :rentalData="rentalData"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <RentalInfoForm
              class="basis-1/2"
              @getData="getChildData"
              :rentalData="rentalData"
              :viewOnly="true"
            />
            <RentalFilesForm
              class="basis-1/2"
              @getData="getChildData"
              :rentalData="rentalData"
              :viewOnly="true"
            />
          </div>
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
