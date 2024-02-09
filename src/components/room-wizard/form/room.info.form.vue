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
  numberOfFloor: 0,
  waterPriceRate: 0,
  lightPriceRate: 0,
  isUseDefaultWaterPriceRate: true,
  isUseDefaultLightPriceRate: true,
  roomRentalPrice: 0,
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
    <h1 class="text-xl font-semibold text-dark-blue-200">Room Information</h1>
    <p class="text-xs">Please input room basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Room Name <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Room Name"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.name"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text">Room description </span>
      </label>
      <input
        type="text"
        placeholder="Room description"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.description"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Floor<span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="number"
        placeholder="Floor"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.floor"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Room rental price per month (baht) <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="number"
        placeholder="Room rental price"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="roomInfo.roomRentalPrice"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Water Price Rate (baht) <span class="text-red-500">*</span>
        </span>
      </label>
      <div class="form-control w-full">
        <input
          type="number"
          placeholder="Water Price Rate"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="roomInfo.waterPriceRate"
          :disabled="viewOnly || roomInfo.isUseDefaultWaterPriceRate"
          :hidden="roomInfo.isUseDefaultWaterPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">Use Default Water Price Rate</span>
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
        <span class="text-base label-text"
          >Electric Price Rate<span class="text-red-500">*</span>
        </span>
      </label>

      <div class="form-control w-full">
        <input
          type="number"
          placeholder="อัตราค่าไฟฟ้า"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="roomInfo.lightPriceRate"
          :disabled="viewOnly || roomInfo.isUseDefaultLightPriceRate"
          :hidden="roomInfo.isUseDefaultLightPriceRate"
        />
        <label class="cursor-pointer label">
          <span class="label-text">Use Default Electric Price Rate</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="roomInfo.isUseDefaultLightPriceRate"
            :disabled="viewOnly"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
