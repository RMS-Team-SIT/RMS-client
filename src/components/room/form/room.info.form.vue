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
  lightPriceRate: 0,
  isUseDefaultWaterPriceRate: false,
  isUseDefaultLightPriceRate: false,
  currentWaterGauge: 0,
  currentLightGauge: 0,
  currentRentals: [],
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
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Room Information</h1>
    <p class="text-xs">Please input resident basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Room Name <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Firstname"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="roomInfo.firstname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Lastname <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Lastname"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="roomInfo.lastname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Email <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="email"
        placeholder="Rental Email"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="roomInfo.email"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Phone <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Phone"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="roomInfo.phone"
        :disabled="viewOnly"
      />
    </div>
  </div>
</template>

<style scoped></style>
