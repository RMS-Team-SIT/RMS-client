<script setup>
import Button from '@/components/common/button.vue';
import { inject } from 'vue';

const emit = defineEmits(['reactiveRenter']);
const swal = inject('$swal');

const reactiveRenter = async () => {
  const confirm = await swal.fire({
    title: 'Are you sure to reactive this renter?',
    showCancelButton: true,
    confirmButtonText: 'Confirm reactive',
    cancelButtonText: 'Discard',
  });

  if (confirm.isConfirmed) {
    emit('reactiveRenter');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">Reactive renter</h1>
    <p class="text-xs">Reactive renter data.</p>
    <Button btnType="success-pill" class="mt-4" @click="reactiveRenter"
      >Reactive</Button
    >
    <p class="text-gray-500 text-sm">
      * To reactive this renter, click reactive buttom. <br />
    </p>
  </div>
</template>

<style scoped></style>
