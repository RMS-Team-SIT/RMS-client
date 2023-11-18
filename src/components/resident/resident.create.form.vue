<script setup>
import Button from '../common/button.vue';
import { useRouter } from 'vue-router';
import { computed, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
  alpha,
  numeric,
  helpers,
} from '@vuelidate/validators';
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import Divider from '../common/divider.vue';

const emit = defineEmits(['form-data']);
const router = useRouter();

const formData = reactive({
  name: '',
  description: '',
  images: [],
  contact: {
    facebook: '',
    line: '',
    phone: '',
    email: '',
    address: '',
  },
  defaultWaterPriceRate: 0.0,
  defaultLightPriceRate: 0.0,
  rooms: [],
});

const submitForm = async () => {
  const result = await validator.value.$validate();
  if (result) emit('form-data', formData);
};
</script>

<template>
  <div class="relative flex flex-col justify-center bg-white">
    <div class="w-full m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10">
        Create Resident
      </h1>
      <p class="text-xs px-10 mb-5">Create your resident.</p>
      <form @submit.prevent="submitForm" class="space-y-4 px-10 mb-5">
        <div>
          <label class="label">
            <span class="text-base label-text">Resident Name</span>
          </label>
          <input
            type="text"
            placeholder="Phone number"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.phone"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Resident Description</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <Divider>Contact</Divider>
        <div>
          <label class="label">
            <span class="text-base label-text">Facebook</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Facebook</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Line</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Phone</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
          />
        </div>
        <Button btnType="primary">Next</Button>
        <button class="btn btn-square btn-outline">
          <ArrowRightIcon class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
