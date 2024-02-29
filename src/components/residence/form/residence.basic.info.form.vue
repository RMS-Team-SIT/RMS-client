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

const residenceInfo = reactive({
  name: '',
  description: '',
  address: '',
});

const emitData = () => {
  emit('getData', residenceInfo);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceInfo) residenceInfo[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลหอพัก</h1>
    <!-- <p class="text-xs">กรุณากรอกข้อมูลพื้นฐานของหอพัก</p> -->
    <div>
      <label class="label">
        <span class="text-base label-text"
          >ชื่อหอพัก <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="ชื่อหอพัก"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceInfo.name"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ที่อยู่ <span class="text-red-500">*</span></span
        >
      </label>
      <textarea
        type="text"
        placeholder="ที่อยู่ของหอพักของคุณ"
        class="w-full textarea textarea-bordered rounded-sm bg-white"
        v-model="residenceInfo.address"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text">รายละเอียดหอพัก</span>
      </label>
      <textarea
        type="text"
        placeholder="รายละเอียดหอพัก"
        class="w-full textarea textarea-bordered rounded-sm bg-white"
        v-model="residenceInfo.description"
        :disabled="viewOnly"
      />
    </div>
    
  </div>
</template>

<style scoped></style>
