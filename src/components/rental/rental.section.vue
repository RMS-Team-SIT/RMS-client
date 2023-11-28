<script setup>
import RentalListTable from './rental.list.table.vue';
import Button from '@/components/common/button.vue';

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
    <RentalListTable :rentals="rentals" />
  </div>
</template>

<style scoped></style>
