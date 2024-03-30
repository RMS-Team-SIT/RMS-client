<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResidenceBasicInfoForm from '@/components/residence/form/residence.basic.info.form.vue';
import ResidenceContactForm from '@/components/residence/form/residence.contact.form.vue';
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';
import ResidenceFacilityForm from '@/components/residence/form/residence.facility.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FacilityService from '@/services/FacilityService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const { notify } = useNotification();

onMounted(async () => {
  await fetchFacility();
  await fetchResidence();
  isLoading.value = false;
});

const residenceData = reactive({
  data: {
    name: '',
    address: '',
    contact: {
      email: '',
      phone: '',
    },
    defaultElectricPriceRate: 0,
    defaultWaterPriceRate: 0,
    facilities: ['6217f4767f9a9d11f0d19b0f'],
  },
});

const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence', result);
    // mapFacility
    result.facilities = result.facilities.map((facility) => facility._id);
    console.log('residence after map fa', result);
    residenceData.data = result;
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

const getChildData = (data) => {
  for (const key in data) {
    residenceData.data[key] = data[key];
  }
};

const submitData = async () => {
  const response = await ResidenceServices.updateResidence(
    residenceId,
    residenceData.data
  );

  if (response.status == 200) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'แก้ไขข้อมูลหอพักสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'dashboard', params: { residenceId: residenceId } });
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถแก้ไขข้อมูลหอพักได้',
      type: 'error',
    });
  }
};

const availableFacility = ref([]);
const fetchFacility = async () => {
  const response = await FacilityService.fetchFacilities();
  if (response.status == 200) {
    const data = await response.json();
    console.log('facility', data);
    availableFacility.value = data;
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลสิ่งอำนวยความสะดวกได้ ' + data?.message,
      type: 'error',
    });
  }
};

const canSubmit = ref(false);
watch(residenceData, () => {
  canSubmit.value =
    residenceData.data.name &&
    residenceData.data.defaultElectricPriceRate &&
    residenceData.data.defaultElectricPriceRate > 0 &&
    residenceData.data.defaultWaterPriceRate &&
    residenceData.data.defaultWaterPriceRate > 0;
});
</script>

<template>
  <div class="card w-full">
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <Loading />
    </div>
    <div v-else class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'หน้าแรก', pathName: 'home' },
            { name: 'จัดการ', pathName: 'manage' },
            { name: residenceData.data.name, pathName: 'dashboard' },
            { name: 'แก้ไขข้อมูลหอพัก' },
          ]"
        />
      </div>
      <div>
        <div class="grid grid-cols-1 lg:grid-cols-1">
          <ResidenceBasicInfoForm
            @getData="getChildData"
            :residenceData="residenceData.data"
          />
          <ResidenceContactForm
            @getData="getChildData"
            :residenceData="residenceData.data"
          />
          <ResidenceFacilityForm
            :residenceData="residenceData"
            :facility-list="availableFacility"
          />
        </div>

        <!-- button control -->
        <div class="flex justify-end gap-2 mt-2">
          <Button
            @click="router.go(-1)"
            class="rounded-badge"
            btnType="secondary"
          >
            ยกเลิก
          </Button>
          <Button
            @click="submitData"
            class="rounded-badge"
            btnType="primary"
            :disabled="!canSubmit"
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
