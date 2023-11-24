<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResidentBasicInfoForm from '@/components/resident/form/resident.basic.info.form.vue';
import ResidentContactForm from '@/components/resident/form/resident.contact.form.vue';
import ResidentSettingForm from '@/components/resident/form/resident.setting.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';

const router = useRouter();
const route = useRoute();
const residentId = route.params.id;
const isLoading = ref(true);
const { notify } = useNotification();

onMounted(async () => {
  try {
    const response = await ResidentServices.fetchResident(residentId);
    if (response.status === 200) {
      let result = await response.json();
      residentData.data = result;
    } else {
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to fetch resident data',
        type: 'error',
      });
    }
  } catch (error) {
    console.error(error);
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch resident data',
      type: 'error',
    });
  } finally {
    isLoading.value = false;
  }
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
  const response = await updateResident(residentId, residentData.data);

  if (response.status == 200) {
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Resident updated successfully',
      type: 'success',
    });
    goBack();
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to update resident',
      type: 'error',
    });
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