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
  direction: {
    type: String,
    default: 'horizontal',
  },
});
</script>

<template>
  <ul
    class="steps text-sm"
    :class="[
      direction === 'horizontal' ? 'steps-horizontal' : 'steps-vertical',
    ]"
  >
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
