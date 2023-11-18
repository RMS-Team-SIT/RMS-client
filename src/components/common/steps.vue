<script setup>
const props = defineProps({
  stepList: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <ul class="steps">
    <li
      v-for="(val, index) in stepList"
      :key="index"
      class="step"
      :class="[index + 1 <= currentStep ? 'step-primary' : '']"
    >
      {{ val }}
    </li>
  </ul>
</template>

<style scoped></style>
