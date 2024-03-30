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
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';

const router = useRouter();
const route = useRoute();
const stepList = ['แก้ไขข้อมูล', 'ตรวจสอบข้อมูล'];
const numberOfSteps = stepList.length;
const residenceId = route.params.residenceId;
const roomId = route.params.roomId;
const currentStep = ref(1);
const { notify } = useNotification();
const isLoading = ref(true);

const payload = reactive({
  defaultWaterPriceRate: '',
  defaultElectricPriceRate: '',
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
  const response = await ResidenceServices.updateUtility(residenceId, {
    ...payload,
  });
  if (response.status == 200) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'แก้ไขข้อมูลค่าสาธารณูปโภคสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'fee', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'แก้ไขข้อมูลค่าสาธารณูปโภคไม่สำเร็จ: ' + data?.message,
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
    console.log('residence', result);
    residence.data = result;
    payload.defaultWaterPriceRate = result.defaultWaterPriceRate;
    payload.defaultElectricPriceRate = result.defaultElectricPriceRate;
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
  isLoading.value = false;
});

const canNext = computed(() => {
  if (currentStep.value === 1) {
    return (
      payload.defaultWaterPriceRate > 0 && payload.defaultElectricPriceRate > 0
    );
  }
  return true;
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
              name: 'จัดการค่าใช้จ่ายในหอพัก',
              pathName: 'fee',
              params: { residenceId },
            },
            { name: 'แก้ไขค่าสาธารณูปโภค' },
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
            <ResidenceSettingForm
              @getData="getChildData"
              :residenceData="payload"
            />
          </div>

          <!-- step 2 -->
          <div v-if="currentStep == 2" class="w-full">
            <ResidenceSettingForm
              @getData="getChildData"
              :residenceData="payload"
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
            @click="router.push({ name: 'fee', params: { residenceId } })"
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
