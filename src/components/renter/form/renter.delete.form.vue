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
    title: 'คุณแน่ใจหรือว่าจะปิดการใช้งานผู้เช่ารายนี้?',
    text: 'คุณจะสามารถเปิดใช้งานผู้เช่ารายนี้ได้ในภายหลัง',
    showCancelButton: true,
    confirmButtonText: 'ปิดการใช้งาน',
    cancelButtonText: 'ยกเลิก',
  });

  if (confirm.isConfirmed) {
    emit('deactiveRenter');
  }
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-red-500">Danger zone</h1>
    <h1 class="text-base font-semibold text-dark-blue-200">
      ปิดการใช้งานผู้เช่า
    </h1>
    <!-- <p class="text-xs">ปิดการใช้งานข้อมูลผู้เช่า</p> -->
    <Button
      btnType="secondary-pill"
      class="mt-4"
      @click="deactiveRenter"
      :disabled="!canDelete"
      >ปิดการใช้งาน</Button
    >
    <p v-if="!canDelete" class="text-gray-500 text-sm">
      * ปิดการใช้งานผู้เช่าไม่ได้ ผู้เช่ารายนี้กำลังเช่าห้องอยู่:

      <span class="text-red-500 underline cursor-pointer">
        <router-link
          :to="{ name: 'update-room', params: { roomId: room._id } }"
        >
          {{ room.name }}
        </router-link>
      </span>
      <br />
      โปรดลบผู้เช่ารายนี้ออกจากห้องก่อน
    </p>
  </div>
</template>

<style scoped></style>
