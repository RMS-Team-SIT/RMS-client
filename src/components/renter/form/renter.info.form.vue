<script setup>
import Button from '@/components/common/button.vue';
import { onMounted, reactive, watch } from 'vue';
import { generatePassword } from '@/utils/password';
import Divider from '@/components/common/divider.vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  renterData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const renterInfo = reactive({
  firstname: '',
  lastname: '',
  username: '',
  phone: '',
  password: '',
});

const emitData = () => {
  emit('getData', renterInfo);
};

const setDataFromProps = () => {
  for (const key in props.renterData) {
    if (key in renterInfo) renterInfo[key] = props.renterData[key];
  }
};

const generateAndSetPassword = () => {
  const password = generatePassword(6);
  renterInfo.password = password;
};

onMounted(() => {
  setDataFromProps();
});

watch(renterInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">Renter Information</h1>
    <p class="text-xs">Please input renter basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Renter Firstname <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Renter Firstname"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.firstname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Renter Lastname <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Renter Lastname"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.lastname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Renter Phone <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Renter Phone"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.phone"
        :disabled="viewOnly"
      />
    </div>

    <h1 class="text-xl mt-5 font-semibold text-dark-blue-200">Renter Account Login</h1>
    <p class="text-xs">Please input renter basic information.</p>
    <div>
      <label class="label">
        <span class="text-base label-text"
          >Renter Username <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Renter Username"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.username"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Renter Password <span class="text-red-500">*</span>
        </span>
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Renter password"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="renterInfo.password"
          :disabled="viewOnly"
        />
        <Button
          v-if="!viewOnly"
          btnType="primary-pill"
          @click="generateAndSetPassword"
          >Generate Password</Button
        >
      </div>
      <p class="text-xs text-gray-500 mt-2">
        * Renter username and password used to login to your renter system.
      </p>
    </div>
  </div>
</template>

<style scoped></style>