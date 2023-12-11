<script setup>
import Button from '@/components/common/button.vue';
import { inject } from 'vue';

const emit = defineEmits(['deleteRental']);
const props = defineProps({
  canDelete: {
    type: Boolean,
    default: false,
  },
});
const swal = inject('$swal');

const deleteRental = async () => {
  const confirm = await swal.fire({
    title: 'Are you sure to delete rental?',
    text: 'You will not be able to recover this rental',
    showCancelButton: true,
    confirmButtonText: 'Confirm delete',
    cancelButtonText: 'Discard',
  });

  if (confirm.isConfirmed) {
    emit('deleteRental');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">Delete rental</h1>
    <p class="text-xs">Delete rental data</p>
    <Button
      btnType="secondary-pill"
      class="mt-4"
      @click="deleteRental"
      :disabled="!canDelete"
      >Delete</Button
    >
    <p v-if="!canDelete" class="text-red-500 text-sm">
      * Cannot delete rental. This rental was linked to {{rental}}. <br />
      Please remove this rental from room first.
    </p>
  </div>
</template>

<style scoped></style>
