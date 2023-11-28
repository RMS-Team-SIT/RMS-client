<script setup>
import Datatable from '../common/datatable.vue';
import RentalListTable from './rental.list.table.vue';
import Button from '@/components/common/button.vue';
import dayjs from 'dayjs';
import blankprofile from '@/assets/img/bp.webp';

const props = defineProps({
  residentId: {
    type: String,
    required: true,
  },
  rentals: {
    type: Array,
    default: () => [],
  },
});
const rentalDataTableHeader = [
  { text: 'Image', value: 'image' },
  { text: 'Email', value: 'email' },
  { text: 'firstname', value: 'firstname' },
  { text: 'lastname', value: 'lastname' },
  { text: 'Phone', value: 'phone' },
  { text: 'Active', value: 'isActive' },
  { text: 'Copy Of ID Card', value: 'copyOfIDCard' },
  { text: 'Rental contract', value: 'rentalContract' },
  { text: 'Created At', value: 'created_at', sortable: true },
  { text: 'Updated At', value: 'updated_at', sortable: true },
  { text: 'Actions', value: 'actions', sortable: false },
];

// parse the date
const rentalData = props.rentals.map((rental) => {
  return {
    ...rental,
    image: rental.image ?? blankprofile,
    created_at: dayjs(rental.created_at).format('MM-DD-YYYY HH:mm:ss'),
    updated_at: dayjs(rental.updated_at).format('MM-DD-YYYY HH:mm:ss'),
    actions: rental.id,
  };
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
            residentId,
          },
        }"
      >
        <Button btnType="primary">Add Rental</Button>
      </router-link>
    </div>

    <Datatable :headers="rentalDataTableHeader" :items="rentalData" />

  </div>
</template>

<style scoped></style>
