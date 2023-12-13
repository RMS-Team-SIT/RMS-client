<script setup>
import Loading from '@/components/common/loading.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['getData']);
const props = defineProps({
  renterData: {
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

const isLoading = ref(true);

const roomInfo = reactive({
  id: null,
  currentRenter: null,
});

const availableRenter = computed(() => {
  return props.renterData.filter(
    (renter) =>
      renter._id != roomInfo.currentRenter &&
      (!renter.room || renter.room._id == roomInfo.id)
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

const addRenter = (renter) => {
  roomInfo.currentRenter = renter._id;
};

const removeRenter = (index) => {
  roomInfo.currentRenter = null;
};

onMounted(() => {
  setDataFromProps();
  isLoading.value = false;
});

watch(roomInfo, () => {
  emitData();
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <Loading />
  </div>
  <div class="relative bg-white p-10 space-y-4 shadow-lg rounded" v-else>
    <h1 class="text-xl font-semibold text-dark-blue-200">
      Room Current Renter
    </h1>

    <!-- List selected renter -->
    <div class="font-bold">Selected Renter</div>
    <p v-if="!roomInfo.currentRenter">
      No renter selected. Please select renter.
    </p>

    <div class="flex flex-col gap-4">
      <div
        v-for="(renter, index) in renterData.filter(
          (renter) => renter._id == roomInfo.currentRenter
        )"
        :key="index"
        class="flex flex-row justify-between items-center"
      >
        <div class="flex flex-row items-center gap-4">
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-dark-blue-200"
              >{{ renter.firstname }} {{ renter.lastname }}</span
            >
            <span class="text-xs text-gray-400">{{ renter.username }}</span>
          </div>
        </div>
        <div class="flex flex-row items-center gap-4">
          <button
            v-if="!viewOnly"
            class="btn btn-sm btn-error"
            @click="removeRenter(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- List all renter except selected renter -->
    <div v-if="!viewOnly">
      <div class="font-bold mb-2">All available renter list</div>
      <p v-if="!renterData.length || !availableRenter.length">
        No renter available. Please create new renter.
      </p>
      <div class="flex flex-col gap-4">
        <div
          v-for="(renter, index) in availableRenter"
          :key="index"
          class="flex flex-row justify-between items-center"
        >
          <div class="flex flex-row items-center gap-4">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-dark-blue-200"
                >{{ renter.firstname }} {{ renter.lastname }}</span
              >
              <span class="text-xs text-gray-400">{{ renter.username }}</span>
            </div>
          </div>
          <div class="flex flex-row items-center gap-4">
            <button
              v-if="!viewOnly"
              class="btn btn-sm btn-primary"
              @click="addRenter(renter)"
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
