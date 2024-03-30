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
import RoomService from '@/services/RoomService';
import RoomCreateManyForm from '@/components/room/form/room.create-many.form.vue';
import RoomCreateManyMoreForm from '@/components/room/form/room.create-many-more.form.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();
const isLoading = ref(true);

const payload = reactive({
  numberOfFloor: 1,
  numberOfRoomEachFloor: [],
  waterPriceRate: 0,
  roomRentalPrice: 0,
  electricPriceRate: 0,
  isUseDefaultWaterPriceRate: true,
  isUseDefaultElectricPriceRate: true,
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
    payload[key] = data[key];
  }
};

const submitData = async () => {
  // Create renter
  const response = await RoomService.createManyRoom(residenceId, {
    ...payload,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'Room created successfully',
      type: 'success',
    });
    router.push({ name: 'room', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to create Room: ' + data?.message,
      type: 'error',
    });
  }
};

const residence = reactive({
  data: null,
});

const fetchResidenceData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    residence.data = result;
    payload.electricPriceRate = residence.data.defaultElectricPriceRate;
    payload.waterPriceRate = residence.data.defaultWaterPriceRate;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  await fetchResidenceData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div class="card w-full" v-else>
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
            { name: 'สร้างห้องพัก' },
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
          <RoomCreateManyForm
            class="w-full"
            @getData="getChildData"
            :payload="payload"
          />
          <RoomCreateManyMoreForm
            class="w-full"
            @getData="getChildData"
            :payload="payload"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <RoomCreateManyForm
              class="w-full"
              @getData="getChildData"
              :payload="payload"
              :viewOnly="true"
            />
            <RoomCreateManyMoreForm
            class="w-full"
            @getData="getChildData"
            :payload="payload"
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
