<script setup>
import loading from '@/components/common/loading.vue';
import ResidenceServices from '@/services/ResidenceServices';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import RoomRenterForm from '@/components/room/form/room.renter.form.vue';
import RoomService from '@/services/RoomService';
import residenceRoomTypeForm from '@/components/residence/form/residence.room-type.form.vue';
import RoomTypeService from '@/services/RoomTypeService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const stepList = ['ป้อนข้อมูล', 'ตรวจสอบข้อมูล'];
const numberOfSteps = stepList.length;
const currentStep = ref(1);
const { notify } = useNotification();
const isLoading = ref(true);

const roomTypeData = reactive({
  roomTypes: [],
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
    roomTypeData[key] = data[key];
  }
};

const submitData = async () => {
  const response = await RoomTypeService.createMany(
    residenceId,
    roomTypeData.roomTypes
  );
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'สร้างประเภทห้องพักสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'room-type', params: { residenceId: residenceId } });
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

const canNext = computed(() => {
  if (currentStep.value === 1) {
    return roomTypeData.roomTypes.length > 0;
  }
  return true;
});

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
              name: 'จัดการประเภทห้องพัก',
              pathName: 'room-type',
              params: { residenceId },
            },
            { name: 'สร้างประเภทห้องพัก' },
          ]"
        />
      </div>

      <div class="grid grid-cols-12">
        <div class="p-4 mb-4 card bg-white col-span-3 items-center">
          <Steps
            direction="vertical"
            :stepList="stepList"
            :currentStep="currentStep"
          />
        </div>
        <div class="p-4 mb-4 card bg-white col-span-9 items-center">
          <!-- step 1 -->
          <div v-if="currentStep == 1" class="w-full">
            <residenceRoomTypeForm
              @getData="getChildData"
              :residenceData="roomTypeData"
            />
          </div>

          <!-- step 2 -->
          <div v-if="currentStep == 2" class="w-full">
            <residenceRoomTypeForm
              @getData="getChildData"
              :residenceData="roomTypeData"
              :viewOnly="true"
            />
          </div>
        </div>
      </div>
      <div>
        <!-- button control -->
        <div class="flex justify-end gap-2 mt-10">
          <Button
            btn-type="secondary"
            @click="router.push({ name: 'room-type', params: { residenceId } })"
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
          <Button
            @click="changeStep('next')"
            
            :disabled="!canNext"
            v-else
          >
            ถัดไป
            <ArrowRightIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
