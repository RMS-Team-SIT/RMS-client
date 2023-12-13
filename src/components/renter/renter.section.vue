<script setup>
import Datatable from '../common/datatable.vue';
import RentalListTable from './renter.list.table.vue';
import Button from '@/components/common/button.vue';
import dayjs from 'dayjs';
import blankprofile from '@/assets/img/bp.webp';
import { onMounted, ref } from 'vue';

const props = defineProps({
  residenceId: {
    type: String,
    required: true,
  },
  rentals: {
    type: Array,
    default: () => [],
  },
});
const rentalData = ref([]);

onMounted(() => {
  // parse the date
  rentalData.value = props.rentals.map((rental, index) => {
    return {
      ...rental,
      index,
      image: rental.image ?? blankprofile,
      created_at: dayjs(rental.created_at).format('MM-DD-YYYY HH:mm:ss'),
      updated_at: dayjs(rental.updated_at).format('MM-DD-YYYY HH:mm:ss'),
      edit: rental._id,
    };
  });
});
</script>

<template>
  <div class="bg-white p-10 mt-2 shadow rounded-lg">
    <div class="flex justify-between">
      <h1 class="text-2xl font-semibold text-dark-blue-200">Rentals</h1>
      <router-link
        :to="{
          name: 'create-rental',
          params: {
            residenceId,
          },
        }"
      >
        <Button btnType="primary">Add Rental</Button>
      </router-link>
    </div>
    <RentalListTable :rentals="rentalData" :residenceId="residenceId" />
  </div>
</template>

<style scoped></style>
