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
  numberOfFloor: 0,
  numberOfRoomEachFloor: 0,
  waterPriceRate: 0,
  roomRentalPrice: 0,
  lightPriceRate: 0,
  isUseDefaultWaterPriceRate: true,
  isUseDefaultLightPriceRate: true,
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

watch(payload, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-lg rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลห้องพัก</h1>
    <p class="text-xs">โปรดกรอกข้อมูลห้องพัก</p>

    <div>
      <label class="label">
        <span class="text-base label-text">จำนวนชั้นทั้งหมดในหอพัก <span class="text-red-500">*</span></span>
      </label>
      <input
        type="number"
        min="1"
        placeholder="จำนวนชั้นทั้งหมดในหอพัก"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="payload.numberOfFloor"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text">จำนวนห้องในแต่ละชั้น<span class="text-red-500">*</span></span> 
        
      </label>
      <input
        type="number"
        min="1"
        placeholder="จำนวนห้องในแต่ละชั้น"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="payload.numberOfRoomEachFloor"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >อัตราค่าเช่าต่อเดือน (บาท)<span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="number"
        min="0"
        placeholder="อัตราค่าเช่าต่อเดือน"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="payload.roomRentalPrice"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >อัตราค่าน้ำ (บาท) <span class="text-red-500">*</span>
        </span>
      </label>
      <div class="form-control w-full">
        <input
          type="number"
          placeholder="อัตราค่าน้ำ"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="payload.waterPriceRate"
          :disabled="viewOnly || payload.isUseDefaultWaterPriceRate"
          :hidden="payload.isUseDefaultWaterPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">ใช้อัตราเริ่มต้นของหอพัก</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="payload.isUseDefaultWaterPriceRate"
            :disabled="viewOnly"
          />
        </label>
      </div>
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text">
          อัตราค่าไฟ (บาท) <span class="text-red-500">*</span>
        </span>
      </label>

      <div class="form-control w-full">
        <input
          type="number"
          placeholder="Light Price Rate"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="payload.lightPriceRate"
          :disabled="viewOnly || payload.isUseDefaultLightPriceRate"
          :hidden="payload.isUseDefaultLightPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">ใช้อัตราเริ่มต้นของหอพัก</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="payload.isUseDefaultLightPriceRate"
            :disabled="viewOnly"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
