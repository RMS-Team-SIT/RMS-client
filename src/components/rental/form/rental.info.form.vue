<script setup>
import Button from '@/components/common/button.vue';
import { onMounted, reactive, watch } from 'vue';
import { generatePassword } from '@/utils/password.util';
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
  username: '',
  phone: '',
  password: '',
});

const emitData = () => {
  emit('getData', rentalInfo);
};

const setDataFromProps = () => {
  for (const key in props.rentalData) {
    if (key in rentalInfo) rentalInfo[key] = props.rentalData[key];
  }
};

const generateAndSetPassword = () => {
  const password = generatePassword(6);
  rentalInfo.password = password;
};

onMounted(() => {
  setDataFromProps();
});

watch(rentalInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">Rental Information</h1>
    <p class="text-xs">Please input rental basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Firstname <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Firstname"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
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
        placeholder="Rental Lastname"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="rentalInfo.lastname"
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
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="rentalInfo.phone"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Username <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Rental Username"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="rentalInfo.username"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Password <span class="text-red-500">*</span>
        </span>
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Rental password"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="rentalInfo.password"
          :disabled="viewOnly"
        />
        <Button
          v-if="!viewOnly"
          btnType="primary-pill"
          @click="generateAndSetPassword"
          >Generate Password</Button
        >
      </div>
      <p class="text-xs text-gray-500 mt-2">* Rental email and password used to login to your rental system.</p>

    </div>
  </div>
</template>

<style scoped></style>
