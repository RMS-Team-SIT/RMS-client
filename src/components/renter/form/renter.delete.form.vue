<script setup>
import Button from '@/components/common/button.vue';
import { inject } from 'vue';

const emit = defineEmits(['deactiveRenter']);
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

const deactiveRenter = async () => {
  const confirm = await swal.fire({
    title: 'Are you sure to deactive this renter?',
    text: 'You will able to reactive this renter later',
    showCancelButton: true,
    confirmButtonText: 'Confirm deactive',
    cancelButtonText: 'Discard',
  });

  if (confirm.isConfirmed) {
    emit('deactiveRenter');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">Deactive renter</h1>
    <p class="text-xs">Deactive renter data</p>
    <Button
      btnType="secondary-pill"
      class="mt-4"
      @click="deactiveRenter"
      :disabled="!canDelete"
      >Deactive</Button
    >
    <p v-if="!canDelete" class="text-gray-500 text-sm">
      * Cannot delete renter. This renter currently renting room:
      <span class="text-red-500 underline cursor-pointer">
        <router-link
          :to="{ name: 'update-room', params: { roomId: room._id } }"
        >
          {{ room.name }}
        </router-link>
      </span>
      . <br />
      Please remove this renter from room first.
    </p>
  </div>
</template>

<style scoped></style>
