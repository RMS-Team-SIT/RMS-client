<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { inject, onMounted, reactive, ref } from 'vue';
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
import Loading from '@/components/common/loading.vue';
import RenterDeleteForm from '@/components/renter/form/renter.delete.form.vue';
import RenterReactiveForm from '@/components/renter/form/renter.reactive.form.vue';
import Alert from '@/components/common/alert.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const renterId = route.params.renterId;
const numberOfSteps = 2;
const currentStep = ref(1);
const { notify } = useNotification();
const swal = inject('$swal');
const isLoading = ref(true);

const renterData = reactive({
  firstname: '',
  lastname: '',
  username: '',
  phone: '',
  image: null,
  copyOfIdCard: { fileName: null, file: null, isEdited: false },
  renterContract: { fileName: null, file: null, isEdited: false },
  password: '',
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

const fetchData = async () => {
  const response = await ResidenceServices.fetchOneRenter(
    residenceId,
    renterId
  );
  if (response.status == 200) {
    const data = await response.json();
    console.log(data);
    renterData.firstname = data.firstname;
    renterData.lastname = data.lastname;
    renterData.username = data.username;
    renterData.phone = data.phone;
    renterData.image = data.image;
    renterData.copyOfIdCard.fileName = data.copyOfIdCard;
    renterData.renterContract.fileName = data.renterContract;
    renterData.password = data.password;
    renterData.room = data.room;
    renterData.isActive = data.isActive;
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch renter data: ' + data?.message,
      type: 'error',
    });
    router.push({
      name: 'renter',
      params: { residenceId: residenceId },
    });
  }
};

const submitData = async () => {
  // Upload files if file changes or exist
  if (renterData.copyOfIdCard.file) {
    // upload file
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
  // end of upload files

  const response = await ResidenceServices.updateRenter(residenceId, renterId, {
    ...renterData,
    copyOfIdCard: renterData.copyOfIdCard.fileName,
    renterContract: renterData.renterContract.fileName,
  });
  if (response.status == 200) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'Renter update successfully',
      type: 'success',
    });
    router.push({
      name: 'renter',
      params: { residenceId: residenceId },
    });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to update Renter: ' + data?.message,
      type: 'error',
    });
  }
};

const deactiveRenter = async () => {
  try {
    const response = await ResidenceServices.deactiveRenter(
      residenceId,
      renterId
    );
    if (response.status == 200) {
      swal.fire({
        title: 'สำเร็จ',
        text: 'Renter deactivated',
        icon: 'success',
      });
      notify({
        title: 'สำเร็จ',
        text: 'Renter deactivated',
        type: 'success',
      });
      router.push({
        name: 'renter',
        params: { residenceId: residenceId },
      });
    } else {
      const data = await response.json();
      notify({
        title: 'Error Delete Renter',
        text: 'Error Delete Renter, ' + data?.message,
        type: 'error',
        group: 'tr',
      });
    }
  } catch (error) {
    notify({
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      type: 'error',
      group: 'tr',
    });
  }
};

const reactiveRenter = async () => {
  try {
    const response = await ResidenceServices.reactiveRenter(
      residenceId,
      renterId
    );
    if (response.status == 200) {
      swal.fire({
        title: 'สำเร็จ',
        text: 'Renter reactivated',
        icon: 'success',
      });
      notify({
        title: 'สำเร็จ',
        text: 'Renter reactivated',
        type: 'success',
      });
      router.push({
        name: 'renter',
        params: { residenceId: residenceId },
      });
    } else {
      const data = await response.json();
      notify({
        title: 'Error to reactive renter',
        text: 'Error reactive Renter, ' + data?.message,
        type: 'error',
        group: 'tr',
      });
    }
  } catch (error) {
    notify({
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
      type: 'error',
      group: 'tr',
    });
  }
};

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div class="card w-full" v-else>
    <div class="card-body px-10 md:px-40">
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
            { name: 'Update Renter' },
            { name: renterId },
          ]"
        />
      </div>

      <Alert v-if="!renterData.isActive">
        ข้อมูลผู้เช่านี้เป็นโหมดดูอย่างเดียว เนื่องจากผู้เช่ารายนี้ถูกปิดใช้งานอยู่
      </Alert>

      <div>
        <div class="p-4 mb-4 card shadow-md bg-white" v-if="renterData.isActive">
          <Steps
            :stepList="['ป้อนข้อมูลผู้เช่า', 'ตรวจสอบข้อมูล']"
            :currentStep="currentStep"
          />
        </div>
        <!-- step 1 -->
        <div v-if="currentStep == 1" class="flex gap-1">
          <RenterInfoForm
            class="basis-1/2"
            @getData="getChildData"
            :renterData="renterData"
            :viewOnly="!renterData.isActive"
          />
          <RenterFilesForm
            class="basis-1/2"
            @getData="getChildData"
            :renterData="renterData"
            :viewOnly="!renterData.isActive"
          />
        </div>
        <div v-if="currentStep == 1" class="flex gap-1 min-w-full mt-1">
          <RenterDeleteForm
            v-if="renterData.isActive"
            class="min-w-full"
            @deactiveRenter="deactiveRenter"
            :canDelete="!renterData.room"
            :room="renterData.room"
          />
          <RenterReactiveForm
            v-else
            class="min-w-full"
            @reactiveRenter="reactiveRenter"
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
        <div v-if="renterData.isActive" class="flex justify-end gap-2 mt-10" >
          <Button
            v-if="currentStep == 1"
            @click="
              router.push({ name: 'renter', params: { residenceId } })
            "
            class="rounded-badge"
            btnType="secondary"
          >
            Cancel
          </Button>
          <Button
            btnType="secondary"
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
            Save
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
