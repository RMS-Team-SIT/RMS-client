<script setup>
import Button from '@/components/common/button.vue';
import { inject } from 'vue';

const emit = defineEmits(['reactiveRenter']);
const swal = inject('$swal');

const reactiveRenter = async () => {
  const confirm = await swal.fire({
    title: 'คุณแน่ใจหรือว่าจะเปิดใช้งานผู้เช่ารายนี้',
    showCancelButton: true,
    confirmButtonText: 'เปิดใช้งาน',
    cancelButtonText: 'ยกเลิก',
  });

  if (confirm.isConfirmed) {
    emit('reactiveRenter');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">เปิดใช้งานผู้เช่า</h1>
    <Button btnType="success-pill" class="mt-4" @click="reactiveRenter"
      >เปิดใช้งาน</Button
    >
    <p class="text-gray-500 text-sm">
      * หากต้องการเปิดใช้ผู้เช่ารายนี้อีกครั้ง ให้กดที่ปุ่มเปิดใช้งาน <br />
    </p>
  </div>
</template>

<style scoped></style>
