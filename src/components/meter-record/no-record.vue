<script setup>
import Button from '@/components/common/button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="card w-full bg-base-100 shadow-xl col-span-3">
    <div class="card-body">
      <h2 class="card-title text-center">ยังไม่มีใบจดมิเตอร์</h2>
      <p class="text-red-500 text-base">
        การใช้งานครั้งแรก กรุณาสร้างใบบันทึกเลขมิเตอร์ปัจจุบัน
      </p>
      <Button
        btnType="primary"
        @click="
          router.push({ name: 'create-meter-record', params: { residenceId } })
        "
      >
        สร้างใบบันทึกเลขมิเตอร์
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
