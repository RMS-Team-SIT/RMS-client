<script setup>
import {
  InformationCircleIcon,
  PaperAirplaneIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';
</script>
<template>
  <header class="flex h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold leading-tight text-light-red">503</h1>
      <WrenchScrewdriverIcon
      class="w-20 h-20 mt-5 text-light-red mx-auto"
      />
      <p class="mt-5">เซิฟเวอร์ไม่พร้อมใช้งาน หรือกำลังปิดปรับปรุงอยู่</p>
      <p class="mt-5">
        โปรดกลับมาใหม่ในภายหลัง
      </p>
    </div>
  </header>
</template>
