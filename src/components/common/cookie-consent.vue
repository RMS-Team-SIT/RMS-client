<script setup>
const onAccept = () => {
  emits('accept');
};

const emits = defineEmits(['accept']);
</script>

<template>
  <div
    class="fixed bottom-1 left-1/2 transform -translate-x-1/2 p-4 bg-white border shadow rounded"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center">
        <span class="text-sm">
          🍪
          เราใช้คุกกี้เพื่อให้แน่ใจว่าคุณได้รับประสบการณ์ที่ดีที่สุดบนเว็บไซต์ของเรา
        </span>
        <button class="ml-4 text-sm underline" @click="onAccept">
          ยอมรับทั้งหมด
        </button>
      </div>
      <button class="text-sm underline" @click="onSettings">
        ตั้งค่าคุกกี้
      </button>
    </div>
  </div>
</template>

<style scoped></style>
