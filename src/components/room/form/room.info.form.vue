<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  roomData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const roomInfo = reactive({
  name: '',
  description: '',
  floor: 0,
  waterPriceRate: 0,
  electricPriceRate: 0,
  isUseDefaultWaterPriceRate: true,
  isUseDefaultElectricPriceRate: true,
  roomRentalPrice: 0,
  isActive: true,
});

const emitData = () => {
  emit('getData', roomInfo);
};

const setDataFromProps = () => {
  for (const key in props.roomData) {
    if (key in roomInfo) roomInfo[key] = props.roomData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(roomInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-lg rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลห้องพัก</h1>
    <p class="text-xs">โปรดกรอกข้อมูลห้องพัก</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ชื่อห้อง/เลขที่ห้อง <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="ชื่อห้อง/เลขที่ห้อง"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.name"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text">คำอธิบาย</span>
      </label>
      <input
        type="text"
        placeholder="คำอธิบาย"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.description"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ชั้น<span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="number"
        placeholder="ชั้น"
        min="1"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.floor"
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
        placeholder="อัตราค่าเช่าต่อเดือน"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.roomRentalPrice"
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
          v-model="roomInfo.waterPriceRate"
          :disabled="viewOnly || roomInfo.isUseDefaultWaterPriceRate"
          :hidden="roomInfo.isUseDefaultWaterPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">ใช้อัตราเริ่มต้นของหอพัก</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="roomInfo.isUseDefaultWaterPriceRate"
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
          placeholder="อัตราค่าไฟฟ้า"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="roomInfo.electricPriceRate"
          :disabled="viewOnly || roomInfo.isUseDefaultElectricPriceRate"
          :hidden="roomInfo.isUseDefaultElectricPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">ใช้อัตราเริ่มต้นของหอพัก</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="roomInfo.isUseDefaultElectricPriceRate"
            :disabled="viewOnly"
          />
        </label>
      </div>

      <hr />
      <div class="form-control w-full mt-5">
        <label class="cursor-pointer label">
          <span class="label-text">เปิด/ปิดใช้งานห้องพัก</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="roomInfo.isActive"
            :disabled="viewOnly"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
