<script setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['getData']);
const props = defineProps({
  rentalData: {
    type: Object,
    default: () => [],
  },
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
  id: null,
  currentRental: null,
});

const availableRental = computed(() => {
  return props.rentalData.filter(
    (rental) =>
      rental._id != roomInfo.currentRental &&
      (!rental.room || rental.room == roomInfo.id)
  );
});
const emitData = () => {
  emit('getData', roomInfo);
};

const setDataFromProps = () => {
  for (const key in props.roomData) {
    if (key in roomInfo) roomInfo[key] = props.roomData[key];
  }
};

const addRental = (rental) => {
  roomInfo.currentRental = rental._id;
};

const removeRental = (index) => {
  roomInfo.currentRental = null;
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
    <h1 class="text-xl font-semibold text-dark-blue-200">
      Room Current Rental
    </h1>

    <!-- List selected rental -->
    <div class="font-bold">Selected Rental</div>
    <p v-if="!roomInfo.currentRental">
      No rental selected. Please select rental.
    </p>

    <div class="flex flex-col gap-4">
      <div
        v-for="(rental, index) in rentalData.filter(
          (rental) => rental._id == roomInfo.currentRental
        )"
        :key="index"
        class="flex flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center gap-4">
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-dark-blue-200"
              >{{ rental.firstname }} {{ rental.lastname }}</span
            >
            <span class="text-xs text-gray-400">{{ rental.email }}</span>
          </div>
        </div>
        <div class="flex flex-row items-center gap-4">
          <button
            v-if="!viewOnly"
            class="btn btn-sm btn-error"
            @click="removeRental(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- List all rental except selected rental -->
    <div v-if="!viewOnly">
      <div class="font-bold mb-2">All available rental list</div>
      <p v-if="!rentalData.length || !availableRental.length">
        No rental available. Please create new rental.
      </p>
      <div class="flex flex-col gap-4">
        <div
          v-for="(rental, index) in availableRental"
          :key="index"
          class="flex flex-row justify-between items-center"
        >
          <div class="flex flex-row items-center gap-4">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-dark-blue-200"
                >{{ rental.firstname }} {{ rental.lastname }}</span
              >
              <span class="text-xs text-gray-400">{{ rental.email }}</span>
            </div>
          </div>
          <div class="flex flex-row items-center gap-4">
            <button
              v-if="!viewOnly"
              class="btn btn-sm btn-primary"
              @click="addRental(rental)"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
