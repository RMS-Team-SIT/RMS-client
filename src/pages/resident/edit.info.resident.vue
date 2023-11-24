<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ResidentBasicInfoForm from '@/components/resident/form/resident.basic.info.form.vue';
import ResidentContactForm from '@/components/resident/form/resident.contact.form.vue';
import ResidentSettingForm from '@/components/resident/form/resident.setting.form.vue';
import ResidentImagesForm from '@/components/resident/form/resident.images.form.vue';
import Button from '@/components/common/button.vue';
import ResidentSummarizeForm from '@/components/resident/form/resident.summarize.form.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import ImagePreview from '@/components/common/image.preview.vue';
import {
  createResident,
  fetchResident,
  updateResident,
} from '@/services/residentServices';
import Loading from '@/components/common/loading.vue';

const router = useRouter();
const route = useRoute();

const residentId = route.params.id;
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await fetchResident(residentId);
    if (response.status === 200) {
      let result = await response.json();
      residentData.data = result;
    } else {
      alert('Failed to fetch residents');
    }
  } catch (error) {
    alert('Failed to fetch user data');
  }
  isLoading.value = false;
});

const residentData = reactive({
  data: {
    name: '',
    description: '',
    address: '',
    contact: {
      facebook: '',
      line: '',
      phone: '',
      email: '',
    },
    defaultWaterPriceRate: 0.0,
    defaultLightPriceRate: 0.0,
  },
});

const getChildData = (data) => {
  console.log('Received data from child', data);
  for (const key in data) {
    residentData.data[key] = data[key];
  }
};

const submitData = async () => {
  console.log('Submit data', residentData.data);
  const response = await updateResident(residentId, residentData.data);
  if (response.status == 200) {
    alert('Resident update successfully');
    goBack();
  } else {
    alert('Failed to update resident');
  }
};
const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="card w-full glass">
    <div v-if="isLoading" class="flex justify-center items-center h-96">
      <Loading />
    </div>
    <div v-else class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Update Resident' },
            { name: residentId },
          ]"
        />
      </div>
      <div>
        <div class="flex gap-2">
          <ResidentBasicInfoForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData.data"
          />
          <ResidentContactForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData.data"
          />
          <ResidentSettingForm
            class="basis-1/3"
            @getData="getChildData"
            :residentData="residentData.data"
          />
        </div>

        <!-- button control -->
        <div class="flex justify-end gap-2 mt-2">
          <Button @click="goBack" class="rounded-badge" btnType="secondary">
            Discard changes
          </Button>
          <Button @click="submitData" class="rounded-badge" btnType="primary">
            Save changes
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
