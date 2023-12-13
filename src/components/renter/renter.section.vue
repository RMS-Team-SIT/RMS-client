<script setup>
import Datatable from '../common/datatable.vue';
import RenterListTable from './renter.list.table.vue';
import Button from '@/components/common/button.vue';
import dayjs from 'dayjs';
import blankprofile from '@/assets/img/bp.webp';
import { onMounted, ref } from 'vue';

const props = defineProps({
  residenceId: {
    type: String,
    required: true,
  },
  renters: {
    type: Array,
    default: () => [],
  },
});
const renterData = ref([]);

onMounted(() => {
  // parse the date
  renterData.value = props.renters.map((renter, index) => {
    return {
      ...renter,
      index,
      image: renter.image ?? blankprofile,
      created_at: dayjs(renter.created_at).format('MM-DD-YYYY HH:mm:ss'),
      updated_at: dayjs(renter.updated_at).format('MM-DD-YYYY HH:mm:ss'),
      edit: renter._id,
    };
  });
});
</script>

<template>
  <div class="bg-white p-10 mt-2 shadow rounded-lg">
    <div class="flex justify-between">
      <h1 class="text-2xl font-semibold text-dark-blue-200">Renters</h1>
      <router-link
        :to="{
          name: 'create-renter',
          params: {
            residenceId,
          },
        }"
      >
        <Button btnType="primary">Add Renter</Button>
      </router-link>
    </div>
    <RenterListTable :renters="renterData" :residenceId="residenceId" />
  </div>
</template>

<style scoped></style>
