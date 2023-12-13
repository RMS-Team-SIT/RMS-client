<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResidenceBasicInfoForm from '@/components/residence/form/residence.basic.info.form.vue';
import ResidenceContactForm from '@/components/residence/form/residence.contact.form.vue';
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const { notify } = useNotification();

onMounted(async () => {
  try {
    const response = await ResidenceServices.fetchResidence(residenceId);
    if (response.status === 200) {
      let result = await response.json();
      residenceData.data = result;
    } else {
      notify({
        group: 'tr',
        title: 'Error',
        text: 'Failed to fetch residence data',
        type: 'error',
      });
      router.push({ name: 'manage' });
    }
  } catch (error) {
    console.error(error);
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch residence data',
      type: 'error',
    });
    router.push({ name: 'manage' });
  } finally {
    isLoading.value = false;
  }
});

const residenceData = reactive({
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
      title: 'Success',
      text: 'Residence updated successfully',
      type: 'success',
    });
    goBack();
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to update residence',
      type: 'error',
    });
  }
};
const goBack = () => {
  router.go(-1);
};
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
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Update Residence' },
            { name: residenceId },
          ]"
        />
      </div>
      <div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <ResidenceBasicInfoForm
            @getData="getChildData"
            :residenceData="residenceData.data"
          />
          <ResidenceContactForm
            @getData="getChildData"
            :residenceData="residenceData.data"
          />
          <ResidenceSettingForm
            @getData="getChildData"
            :residenceData="residenceData.data"
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
@/services/ResidenceServices