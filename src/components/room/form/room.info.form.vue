<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  roomData: {
    type: Object,
    default: () => ({}),
  },
  roomTypes: {
    type: Array,
    default: () => [],
  },
  fees: {
    type: Array,
    default: () => [],
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
  type: '',
  fees: [],
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

watch(
  () => roomInfo.type,
  () => {
    setRoomRentalPriceByType();
  }
);
const setRoomRentalPriceByType = () => {
  if (roomInfo.type) {
    const type = props.roomTypes.find((type) => type._id === roomInfo.type);
    roomInfo.roomRentalPrice = type.price;
  }
};
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
      <textarea
        class="textarea textarea-bordered w-full"
        placeholder="คำอธิบาย"
        cols="30"
        rows="5"
        v-model="roomInfo.description"
        :disabled="viewOnly"
      >
      </textarea>
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
          >ประเภทห้อง<span class="text-red-500">*</span>
        </span>
      </label>
      <select
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.type"
        :disabled="viewOnly"
      >
        <option value="" disabled>กรุณาเลือกประเภทห้อง</option>
        <option
          v-for="(type, index) in roomTypes"
          :key="index"
          :value="type._id"
        >
          {{ type.name }}
        </option>
      </select>
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

    <div class="col-span-2">
      <label class="label">
        <span class="text-base label-text"
          >ค่าบริการเพิ่มเติม <span class="text-red-500">*</span>
        </span>
      </label>
      <p class="p-2" v-if="!fees.length">ไม่มีค่าบริการเพิ่มเติมในหอพัก</p>
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div
          v-for="(fee, feeIndex) in fees"
          :key="feeIndex"
          class="flex items-center gap-2"
        >
          <input
            :disabled="viewOnly"
            type="checkbox"
            :id="index + fee._id"
            :value="fee._id"
            v-model="roomData.fees"
            class="checkbox checkbox-primary"
          />
          <label :for="index + fee._id" class="label text-sm">
            {{ fee.feename }} : {{ fee.feeprice }} บาท
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
