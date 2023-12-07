<script setup>
import ResidentServices from '@/services/ResidentServices';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();

const roomData = reactive({
  name: '',
  description: '',
  floor: 0,
  waterPriceRate: 0,
  lightPriceRate: 0,
  isUseDefaultWaterPriceRate: false,
  isUseDefaultLightPriceRate: false,
  currentWaterGauge: 0,
  currentLightGauge: 0,
  currentRentals: [],
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
    roomData[key] = data[key];
  }
};

const submitData = async () => {
  // Upload files
  //   if (rentalData.copyOfIdCard.file) {
  //     const uploadFileResponse = await FileService.uploadPdf(
  //       rentalData.copyOfIdCard.file
  //     );
  //     if (uploadFileResponse.status != 201) {
  //       notify({
  //         group: 'tr',
  //         title: 'Error',
  //         text: 'Failed to upload files',
  //         type: 'error',
  //       });
  //       return;
  //     } else {
  //       const data = await uploadFileResponse.json();
  //       rentalData.copyOfIdCard.fileName = data.fileName;
  //     }
  //   }

  //   if (rentalData.rentalContract.file) {
  //     const uploadFileResponse = await FileService.uploadPdf(
  //       rentalData.rentalContract.file
  //     );
  //     if (uploadFileResponse.status != 201) {
  //       const data = await response.json();
  //       notify({
  //         group: 'tr',
  //         title: 'Error',
  //         text: 'Failed to upload files, ' + data?.message,
  //         type: 'error',
  //       });
  //       return;
  //     } else {
  //       const data = await uploadFileResponse.json();
  //       rentalData.rentalContract.fileName = data.fileName;
  //     }
  //   }
  // End upload files

  // Create rental
  const response = await ResidentServices.createRoom(residentId, {
    ...roomData,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Room created successfully',
      type: 'success',
    });
    router.push({ name: 'manage-resident', params: { residentId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to create Room: ' + data?.message,
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
            { name: 'Create Room' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="['Room Infomation', 'Review Room']"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-4">
          <RoomInfoForm
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
        <div class="flex justify-end gap-2 mt-10">
          <Button
            btn-type="secondary"
            @click="
              router.push({ name: 'manage-resident', params: { residentId } })
            "
            v-if="currentStep == 1"
            class="rounded-badge"
          >
            Discard
          </Button>
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
