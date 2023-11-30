<script setup>
import { ref } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import Button from '@/components/common/button.vue';

const random = () => Math.random().toString(36).substr(2, 9);
const randomId = random();
</script>

<template>
  <label :for="`modal-${randomId}`">View</label>

  <input
    type="checkbox"
    :id="`modal-${randomId}`"
    class="modal-toggle"
  />
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 modal"
    role="dialog"
  >
    <div class="modal-box">
      <slot />
    </div>
    <label
      class="modal-backdrop text-black"
      :for="`modal-${randomId}`"
      >Close</label
    >
  </div>
</template>

<style scoped></style>
