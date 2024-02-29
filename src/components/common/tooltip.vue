<template>
  <div class="relative">
    <button
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      class="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      Hover me
    </button>
    <transition name="fade">
      <div
        v-if="showTooltip"
        class="absolute z-10 -mt-12 px-4 py-2 bg-blue-900 text-white rounded-md shadow-lg"
      >
        This is a tooltip
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showTooltip = ref(false);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
