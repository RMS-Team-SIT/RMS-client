<script setup>
import loading from '@/components/common/loading.vue';
import ResidentServices from '@/services/ResidentServices';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();
const isLoading = ref(true);

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

const resident = reactive({
  data: null,
});

const fetchResidentData = async () => {
  const response = await ResidentServices.fetchResident(residentId);
  if (response.status === 200) {
    let result = await response.json();
    resident.data = result;
    console.log(resident.data);
    // set default value of roomData
    roomData.lightPriceRate = resident.data.defaultLightPriceRate;
    roomData.waterPriceRate = resident.data.defaultWaterPriceRate;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch resident data',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  await fetchResidentData();
  isLoading.value = false;
});
</script>

<template>
  <loading v-if="isLoading" class="min-h-screen" />
  <div class="card w-full glass" v-else>
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
            <RoomInfoForm
              class="basis-1/2"
              @getData="getChildData"
              :rentalData="rentalData"
              :viewOnlys="true"
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
