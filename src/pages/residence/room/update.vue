<script setup>
import loading from '@/components/common/loading.vue';
import ResidenceServices from '@/services/ResidenceServices';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import RoomRenterForm from '@/components/room/form/room.renter.form.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const roomId = route.params.roomId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();
const isLoading = ref(true);

const roomData = reactive({
  id: roomId,
  name: '',
  description: '',
  floor: 1,
  type: '',
  fees: [],
  // waterPriceRate: 0,
  // electricPriceRate: 0,
  // isUseDefaultWaterPriceRate: true,
  // isUseDefaultElectricPriceRate: true,
  // defaultWaterPriceRate: 0,
  // defaultElectricPriceRate: 0,
  currentRenter: null,
  roomRentalPrice: 0,
  isActive: true,
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
  // Create renter
  const response = await ResidenceServices.updateRoom(residenceId, roomId, {
    ...roomData,
  });
  if (response.status == 200) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'แก้ไขข้อมูลห้องพักสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'room', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to update Room: ' + data?.message,
      type: 'error',
    });
  }
};

const residence = reactive({
  data: null,
});

const fetchRoomData = async () => {
  const response = await ResidenceServices.fetchOneRoomInResidence(
    residenceId,
    roomId
  );
  if (response.status === 200) {
    let result = await response.json();
    console.log('room', result);
    // set value of roomData
    roomData.name = result.name;
    roomData.description = result.description;
    roomData.floor = result.floor;
    roomData.type = result.type._id;
    roomData.fees = result.fees.map((fee) => fee._id);
    roomData.currentRenter = result.currentRenter;
    roomData.roomRentalPrice = result.roomRentalPrice;
    roomData.isActive = result.isActive;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

const fetchResidenceData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence', result);
    residence.data = result;
    // set default value of roomData
    roomData.electricPriceRate = residence.data.defaultElectricPriceRate;
    roomData.defaultElectricPriceRate = residence.data.defaultElectricPriceRate;
    roomData.waterPriceRate = residence.data.defaultWaterPriceRate;
    roomData.defaultWaterPriceRate = residence.data.defaultWaterPriceRate;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  await fetchResidenceData();
  await fetchRoomData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div class="card w-full min-h-screen" v-else>
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'หน้าแรก', pathName: 'home' },
            { name: 'จัดการ', pathName: 'manage' },
            {
              name: 'แดชบอร์ด',
              pathName: 'dashboard',
              params: { residenceId },
            },
            {
              name: 'ห้องพัก',
              pathName: 'room',
              params: { residenceId },
            },
            { name: 'แก้ไขข้อมูลห้องพัก' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="['ป้อนข้อมูล', 'ตรวจสอบข้อมูล']"
            :currentStep="currentStep"
          />
        </div>

        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-4">
          <RoomInfoForm
            class="basis-1/2"
            @getData="getChildData"
            :roomData="roomData"
            :roomTypes="residence.data.roomTypes"
            :fees="residence.data.fees"
          />
          <RoomRenterForm
            class="basis-1/2"
            @getData="getChildData"
            :roomData="roomData"
            :renterData="residence.data.renters"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <RoomInfoForm
              class="basis-1/2"
              @getData="getChildData"
              :roomData="roomData"
              :roomTypes="residence.data.roomTypes"
              :fees="residence.data.fees"
              :viewOnly="true"
            />
            <RoomRenterForm
              class="basis-1/2"
              @getData="getChildData"
              :roomData="roomData"
              :renterData="residence.data.renters"
              :viewOnly="true"
            />
          </div>
        </div>

        <!-- button control -->
        <div class="flex justify-end gap-2 mt-10">
          <Button
            btn-type="secondary"
            @click="router.push({ name: 'room', params: { residenceId } })"
            v-if="currentStep == 1"
            
          >
            ยกเลิก
          </Button>
          <Button
            btn-type="secondary"
            @click="changeStep('back')"
            v-if="currentStep > 1"
            
          >
            <ArrowLeftIcon class="w-4 h-4" />
            ย้อนกลับ
          </Button>
          <Button
            v-if="currentStep == numberOfSteps"
            @click="submitData"
            
            btnType="primary"
          >
            บันทึกข้อมูล
          </Button>
          <Button @click="changeStep('next')"  v-else>
            ถัดไป
            <ArrowRightIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
