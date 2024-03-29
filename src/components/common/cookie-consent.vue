<template>
  <div>
    <!-- Full-page overlay -->
    <!-- <div class="fixed inset-0 bg-black opacity-50 z-50"></div> -->

    <!-- Cookie consent dialog -->
    <div
      class="fixed bottom-1 left-1/2 transform -translate-x-1/2 p-4 bg-white border shadow rounded z-50"
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center">
          <span class="text-sm">
            🍪 เราใช้คุกกี้เพื่อให้แน่ใจว่าคุณได้รับประสบการณ์ที่ดีที่สุดบนเว็บไซต์ของเรา
          </span>
          <button class="ml-4 text-sm underline" @click="onAccept">
            ยอมรับทั้งหมด
          </button>
        </div>
        <!-- <button class="text-sm underline" @click="onSettings">
          ตั้งค่าคุกกี้
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
const onAccept = () => {
  emits('accept');
};

const onSettings = () => {
  emits('settings');
};

const emits = defineEmits(['accept', 'settings']);
</script>

<style scoped>
/* Style for the full-page overlay */
.bg-black {
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
}
</style>
