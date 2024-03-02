<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

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
  facilityList: {
    type: Array,
    default: () => [],
  },
});

const residenceFacility = reactive({
  facilities: [],
});

const emitData = () => {
  emit('getData', residenceFacility);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceFacility)
      residenceFacility[key] = props.residenceData[key];
  }
};

const selectAllFacility = (e) => {
  console.log(e);
  if (e.target.checked) {
    residenceFacility.facilities = props.facilityList.map(
      (facility) => facility._id
    );
  } else {
    residenceFacility.facilities = [];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceFacility, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">
      สิ่งอำนวยความสะดวกภายในหอพัก
    </h1>
    <p class="text-sm">กรุณาเลือกสิ่งอำนวยความสะดวกที่มีในหอพักของคุณ</p>
    <!-- select all -->
    <div class="flex items-center gap-2 text-sm">
      <input
        :checked="
          residenceFacility.facilities.length === props.facilityList.length
        "
        type="checkbox"
        id="selectAll"
        class="checkbox checkbox-primary"
        @change="selectAllFacility"
      />
      <label for="selectAll" class="label">เลือกทั้งหมด</label>
    </div>
    <!-- facility list -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm"
    >
      <div
        v-for="(facility, index) in facilityList"
        :key="index"
        class="flex items-center gap-2"
      >
        <input
          type="checkbox"
          :id="facility._id"
          :value="facility._id"
          v-model="residenceFacility.facilities"
          class="checkbox checkbox-primary"
        />
        <label :for="facility._id" class="label">
          {{ facility.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
