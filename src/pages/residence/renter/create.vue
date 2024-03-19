<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import RenterInfoForm from '@/components/renter/form/renter.info.form.vue';
import RenterFilesForm from '@/components/renter/form/renter.files.form.vue';
import FileService from '@/services/FileService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const stepList = ['ข้อมูลผู้เช่า', 'ไฟล์เกี่ยวกับผู้เช่า', 'ตรวจสอบข้อมูล'];
const numberOfSteps = stepList.length;
const currentStep = ref(1);
const { notify } = useNotification();

const renterData = reactive({
  firstname: '',
  lastname: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  image: { fileName: null, file: null, isEdited: false },
  copyOfIdCard: { fileName: null, file: null, isEdited: false },
  renterContract: { fileName: null, file: null, isEdited: false },
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

const canNext = computed(() => {
  if (currentStep.value == 1) {
    return (
      renterData.firstname &&
      renterData.lastname &&
      renterData.username &&
      renterData.phone &&
      renterData.email &&
      renterData.password
    );
  } else if (currentStep.value == 2) {
    return renterData.copyOfIdCard.file && renterData.renterContract.file;
  }
  return true;
});

const getChildData = (data) => {
  for (const key in data) {
    renterData[key] = data[key];
  }
};

const submitData = async () => {
  if (
    !renterData.firstname ||
    !renterData.lastname ||
    !renterData.username ||
    !renterData.phone ||
    !renterData.email
  ) {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'โปรดกรอกข้อมูลให้ครบถ้วน',
      type: 'error',
    });
    return;
  }

  // Upload files
  if (renterData.copyOfIdCard.file) {
    const uploadFileResponse = await FileService.uploadPdfWatermark(
      renterData.copyOfIdCard.file
    );
    if (uploadFileResponse.status != 201) {
      const data = await uploadFileResponse.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปโหลดไฟล์ได้, ' + data?.message,
        type: 'error',
      });
      return;
    } else {
      const data = await uploadFileResponse.json();
      renterData.copyOfIdCard.fileName = data.fileName;
    }
  }

  if (renterData.renterContract.file) {
    const uploadFileResponse = await FileService.uploadPdfWatermark(
      renterData.renterContract.file
    );
    if (uploadFileResponse.status != 201) {
      const data = await uploadFileResponse.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'Failed to upload files, ' + data?.message,
        type: 'error',
      });
      return;
    } else {
      const data = await uploadFileResponse.json();
      renterData.renterContract.fileName = data.fileName;
    }
  }
  // End upload files

  // Create renter
  const response = await ResidenceServices.createRenter(residenceId, {
    ...renterData,
    image: renterData.image.fileName,
    renterContract: renterData.renterContract.fileName,
    copyOfIdCard: renterData.copyOfIdCard.fileName,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'เพิ่มผู้เช่าสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'renter', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเพิ่มผู้เช่าได้, ' + data?.message,
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="card w-full">
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
              name: 'ผู้เช่า',
              pathName: 'renter',
              params: { residenceId },
            },
            { name: 'จัดการผู้เช่า' },
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
            <RenterInfoForm @getData="getChildData" :renterData="renterData" />
          </div>

          <!-- step 2 -->
          <div v-if="currentStep == 2" class="w-full">
            <RenterFilesForm @getData="getChildData" :renterData="renterData" />
          </div>

          <!-- step 3 -->
          <div v-if="currentStep == 3" class="w-full">
            <RenterInfoForm
              @getData="getChildData"
              :renterData="renterData"
              :viewOnly="true"
            />
            <RenterFilesForm
              @getData="getChildData"
              :renterData="renterData"
              :viewOnly="true"
            />
          </div>
        </div>
      </div>
      <!-- button control -->
      <div class="flex justify-end gap-2 mt-10">
        <Button
          btn-type="secondary"
          @click="router.push({ name: 'renter', params: { residenceId } })"
          v-if="currentStep == 1"
          class="rounded-badge"
        >
          ยกเลิก
        </Button>
        <Button
          btn-type="secondary"
          @click="changeStep('back')"
          v-if="currentStep > 1"
          class="rounded-badge"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          ย้อนกลับ
        </Button>
        <Button
          v-if="currentStep == numberOfSteps"
          @click="submitData"
          class="rounded-badge"
          btnType="primary"
        >
          บันทึกข้อมูล
        </Button>
        <Button
          @click="changeStep('next')"
          :disabled="!canNext"
          class="rounded-badge"
          v-else
        >
          ถัดไป
          <ArrowRightIcon class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
