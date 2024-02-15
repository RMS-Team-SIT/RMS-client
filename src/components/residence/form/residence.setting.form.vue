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

const error = reactive({
  defaultWaterPriceRate: false,
  defaultLightPriceRate: false,
});

const emitData = () => {
  emit('getData', residenceSettings);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceSettings)
      residenceSettings[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceSettings, () => {
  error.defaultLightPriceRate =
    residenceSettings.defaultLightPriceRate < 0 ||
    residenceSettings.defaultLightPriceRate === '';
  error.defaultWaterPriceRate =
    residenceSettings.defaultWaterPriceRate < 0 ||
    residenceSettings.defaultWaterPriceRate === '';

  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลเพิ่มเติม</h1>
    <p class="text-xs">โปรดใส่ข้อมูลเพิ่มเติม</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ค่าน้ำ (บาท/หน่วย) <span class="text-red-500">*</span></span
        >
      </label>
      <input
        type="number"
        min="0"
        placeholder="ค่าน้ำ (บาท/หน่วย) "
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceSettings.defaultWaterPriceRate"
        :disabled="viewOnly"
      />
      <p class="text-xs text-red-500" v-if="error.defaultWaterPriceRate">
        ค่าน้ำห้ามต่ำกว่า 0 *
      </p>
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ค่าไฟฟ้า (บาท/หน่วย) <span class="text-red-500">*</span></span
        >
      </label>
      <input
        type="number"
        min="0"
        placeholder="ค่าไฟฟ้า (บาท/หน่วย)"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceSettings.defaultLightPriceRate"
        :disabled="viewOnly"
      />
      <p class="text-xs text-red-500" v-if="error.defaultLightPriceRate">
        ค่าไฟฟ้าห้ามต่ำกว่า 0 *
      </p>
    </div>
  </div>
</template>

<style scoped></style>
