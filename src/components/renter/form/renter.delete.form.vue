<script setup>
import Button from '@/components/common/button.vue';
import { inject } from 'vue';

const emit = defineEmits(['deleteRenter']);
const props = defineProps({
  canDelete: {
    type: Boolean,
    default: false,
  },
  room: {
    type: String,
    default: '',
  },
});
const swal = inject('$swal');

const deleteRenter = async () => {
  const confirm = await swal.fire({
    title: 'Are you sure to delete renter?',
    text: 'You will not be able to recover this renter',
    showCancelButton: true,
    confirmButtonText: 'Confirm delete',
    cancelButtonText: 'Discard',
  });

  if (confirm.isConfirmed) {
    emit('deleteRenter');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">Delete renter</h1>
    <p class="text-xs">Delete renter data</p>
    <Button
      btnType="secondary-pill"
      class="mt-4"
      @click="deleteRenter"
      :disabled="!canDelete"
      >Delete</Button
    >
    <p v-if="!canDelete" class="text-gray-500 text-sm">
      * Cannot delete renter. This renter was linked to
      <span class="text-red-500 underline cursor-pointer">
        <router-link :to="{ name: 'update-room', params: { roomId: room._id } }">
          {{ room.name }}
        </router-link>
      </span>
      . <br />
      Please remove this renter from room first.
    </p>
  </div>
</template>

<style scoped></style>
