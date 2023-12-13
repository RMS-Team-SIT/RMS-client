<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  residenceData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const residenceSettings = reactive({
  defaultWaterPriceRate: 0.0,
  defaultLightPriceRate: 0.0,
});

const emitData = () => {
  emit('getData', residenceSettings);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceSettings) residenceSettings[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceSettings, () => {
  emitData();
});

</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">Residence Settings</h1>
    <p class="text-xs">Please input residence settings.</p>
    <div>
      <label class="label">
        <span class="text-base label-text">Default Light Price Rate (Per unit) <span class="text-red-500">*</span></span>
      </label>
      <input
        type="number"
        min="0"
        placeholder="Default Light Price Rate"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residenceSettings.defaultLightPriceRate"
        :disabled="viewOnly"
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
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residenceSettings.defaultWaterPriceRate"
        :disabled="viewOnly"
      />
    </div>
  </div>
</template>

<style scoped></style>
