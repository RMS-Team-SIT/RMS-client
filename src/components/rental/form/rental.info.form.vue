<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  rentalData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const rentalInfo = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
});

const emitData = () => {
  emit('getData', rentalInfo);
  console.log('Emitted residentInfo', rentalInfo);
};

const setDataFromProps = () => {
  for (const key in props.rentalData) {
    if (key in rentalInfo) rentalInfo[key] = props.rentalData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(rentalInfo, () => {
  console.log('Rental info changed');
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">
      Rental Information
    </h1>
    <p class="text-xs">Please input resident basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Firstname <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Name"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="rentalInfo.firstname"
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
        placeholder="Rental Name"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="rentalInfo.lastname"
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
        type="text"
        placeholder="Rental Name"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="rentalInfo.email"
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
        placeholder="Rental Name"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="rentalInfo.phone"
        :disabled="viewOnly"
      />
    </div>
  </div>
</template>

<style scoped></style>
