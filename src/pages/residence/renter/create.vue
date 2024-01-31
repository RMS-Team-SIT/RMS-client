<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import RenterInfoForm from '@/components/renter/form/renter.info.form.vue';
import RenterFilesForm from '@/components/renter/form/renter.files.form.vue';
import FileService from '@/services/FileService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();

const renterData = reactive({
  firstname: '',
  lastname: '',
  username: '',
  phone: '',
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

const getChildData = (data) => {
  for (const key in data) {
    renterData[key] = data[key];
  }
};

const submitData = async () => {
  // Upload files
  if (renterData.copyOfIdCard.file) {
    const uploadFileResponse = await FileService.uploadPdf(
      renterData.copyOfIdCard.file
    );
    if (uploadFileResponse.status != 201) {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'Failed to upload files',
        type: 'error',
      });
      return;
    } else {
      const data = await uploadFileResponse.json();
      renterData.copyOfIdCard.fileName = data.fileName;
    }
  }

  if (renterData.renterContract.file) {
    const uploadFileResponse = await FileService.uploadPdf(
      renterData.renterContract.file
    );
    if (uploadFileResponse.status != 201) {
      const data = await response.json();
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
      text: 'Renter created successfully',
      type: 'success',
    });
    router.push({ name: 'renter', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to create Renter: ' + data?.message,
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="card w-full ">
    <div class="card-body px-10 md:px-40 ">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            {
              name: 'Residence',
              pathName: 'dashboard',
              params: { residenceId },
            },
            { name: 'Create Renter' },
          ]"
        />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="['ป้อนข้อมูลผู้เช่า', 'ตรวจสอบข้อมูล']"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-4">
          <RenterInfoForm
            class="basis-1/2"
            @getData="getChildData"
            :renterData="renterData"
          />
          <RenterFilesForm
            class="basis-1/2"
            @getData="getChildData"
            :renterData="renterData"
          />
        </div>

        <!-- step 2 -->
        <div v-if="currentStep == 2" class="flex gap-4 flex-col">
          <div class="flex gap-4">
            <RenterInfoForm
              class="basis-1/2"
              @getData="getChildData"
              :renterData="renterData"
              :viewOnly="true"
            />
            <RenterFilesForm
              class="basis-1/2"
              @getData="getChildData"
              :renterData="renterData"
              :viewOnly="true"
            />
          </div>
        </div>

        <!-- button control -->
        <div class="flex justify-end gap-2 mt-10">
          <Button
            btn-type="secondary"
            @click="
              router.push({ name: 'dashboard', params: { residenceId } })
            "
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
          <Button @click="changeStep('next')" class="rounded-badge" v-else>
            ถัดไป
            <ArrowRightIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>