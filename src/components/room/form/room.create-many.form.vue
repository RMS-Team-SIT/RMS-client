<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const payload = reactive({
  numberOfFloor: 1,
  numberOfRoomEachFloor: [],
  // roomRentalPrice: 0,
});

const emitData = () => {
  emit('getData', payload);
};

const setDataFromProps = () => {
  for (const key in props.payload) {
    if (key in payload) payload[key] = props.payload[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(payload, (prev, curr) => {
  if (payload.numberOfRoomEachFloor.length > payload.numberOfFloor)
    payload.numberOfRoomEachFloor.pop();
  emitData();
});

watch(payload.numberOfFloor, () => {
  console.log('number of floor change');
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-lg rounded w-full">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลแผนผังห้องพัก</h1>
    <p class="text-xs">โปรดกรอกข้อมูลแผนผังห้องพัก</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >จำนวนชั้นทั้งหมดในหอพัก <span class="text-red-500">*</span></span
        >
      </label>
      <input
        type="number"
        min="1"
        max="20"
        placeholder="จำนวนชั้นทั้งหมดในหอพัก"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="payload.numberOfFloor"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >จำนวนห้องในแต่ละชั้น<span class="text-red-500">*</span></span
        >
      </label>

      <div v-for="(_, index) in payload.numberOfFloor" :key="index" class="p-1">
        <p class="text-base">จำนวนห้องในชั้น {{ index + 1 }}</p>
        <input
          type="number"
          min="1"
          max="100"
          :placeholder="`จำนวนห้องชั้น ${index + 1}`"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="payload.numberOfRoomEachFloor[index]"
          :disabled="viewOnly"
        />
      </div>
      <p class="text-sm text-red-500 p-1">
        ระบบจะสร้างห้องทั้งหมด
        {{ payload.numberOfRoomEachFloor.reduce((a, b) => a + b, 0) }} ห้อง
      </p>
    </div>

    <!-- <div>
      <label class="label">
        <span class="text-base label-text"
          >อัตราค่าเช่าของแต่ละห้อง (บาท) <span class="text-red-500">*</span></span
        >
      </label>
      <input
        type="number"
        min="0"
        placeholder="ค่าเช่าของแต่ละห้อง"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="payload.roomRentalPrice"
        :disabled="viewOnly"
      />
    </div> -->
  </div>
</template>

<style scoped></style>
