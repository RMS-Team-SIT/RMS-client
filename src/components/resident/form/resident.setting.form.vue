<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['getData']);

const residentSettings = reactive({
  defaultWaterPriceRate: 0.0,
  defaultLightPriceRate: 0.0,
});

const emitData = () => {
  emit('getData', residentSettings);
  console.log('Emitted residentSettings', residentSettings);
};
</script>

<template>
  <form @change="emitData" class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Resident Settings</h1>
    <p class="text-xs">Please input resident settings.</p>
    <div>
      <label class="label">
        <span class="text-base label-text">Default Light Price Rate (Per unit) <span class="text-red-500">*</span></span>
      </label>
      <input
        type="number"
        min="0"
        placeholder="Default Light Price Rate"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentSettings.defaultLightPriceRate"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Default Water Price Rate (Per unit) <span class="text-red-500">*</span></span>
      </label>
      <input
        type="number"
        min="0"
        placeholder="Email Address"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentSettings.defaultWaterPriceRate"
      />
    </div>
  </form>
</template>

<style scoped></style>
