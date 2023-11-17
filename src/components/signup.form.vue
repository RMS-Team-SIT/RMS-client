<script setup>
import Button from './button.vue';
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
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['form-data']);
const router = useRouter();

const formData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
});

const passwordRules = computed(() => [
  {
    text: 'Contain 8 Letters',
    valid: computed(() => formData.password.length >= 8),
  },
  {
    text: 'Contain Upper Letter',
    valid: computed(() => new RegExp(`[A-Z]`).test(formData.password)),
  },
  {
    text: 'Contain Lower Letter',
    valid: computed(() => new RegExp(`[a-z]`).test(formData.password)),
  },
  {
    text: 'Contain Number',
    valid: computed(() => new RegExp(`[0-9]`).test(formData.password)),
  },
  {
    text: 'Contain Symbol',
    valid: computed(() => new RegExp(`[^A-Za-z0-9]`).test(formData.password)),
  },
]);

const strongPassword = () => {
  return passwordRules.value.every((rule) => rule.valid.value);
};

const rules = computed(() => {
  return {
    firstname: { required, maxLength: maxLength(500) },
    lastname: { required, maxLength: maxLength(500) },
    email: { required, email },
    password: {
      required,
      strongPassword: helpers.withMessage(
        "Password doen't meet the rules",
        strongPassword
      ),
    },
    confirmPassword: {
      required,
      minLength: minLength(6),
      sameAs: sameAs(formData.password),
    },
    phone: { required },
  };
});

const validator = useVuelidate(rules, formData);

const submitForm = async () => {
  const result = await validator.value.$validate();
  if (result) emit('form-data', formData);
};

const submitForm2 = async () => {
  const result = await validator.value.$validate();
  if (result) {
    alert('Form submitted');
  } else {
    alert('Form not submitted');
  }
};

const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};
</script>

<template>
  <div
    class="relative flex flex-col justify-center h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-6 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10 mb-5">
        Start Signing Up <br />
        for Free
      </h1>
      <p class="text-sm px-10 mb-5">Create your account to get started.</p>
      <form @submit.prevent="submitForm" class="space-y-4 px-10 mb-5">
        <div class="flex gap-2">
          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">Firstname</span>
            </label>
            <input
              type="text"
              placeholder="Firstname"
              class="w-full input-sm input input-bordered rounded-sm"
              v-model="formData.firstname"
            />
            <span class="text-sm text-red-500">
              {{ validateErrorMsg('firstname') }}</span
            >
          </div>

          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">Lastname</span>
            </label>
            <input
              type="text"
              placeholder="Lastname"
              class="w-full input input-bordered input-sm rounded-sm"
              v-model="formData.lastname"
            />
            <span class="text-sm text-red-500">{{
              validateErrorMsg('lastname')
            }}</span>
          </div>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Phone Number</span>
          </label>
          <input
            type="text"
            placeholder="Phone number"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.phone"
          />
          <span class="text-sm text-red-500">{{
            validateErrorMsg('phone')
          }}</span>
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
          <span class="text-sm text-red-500">{{
            validateErrorMsg('email')
          }}</span>
          <p class="text-sm text-gray-500">
            Please use a real email address for future correspondence
          </p>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.password"
          />
          <span class="text-sm text-red-500"
            >{{ validateErrorMsg('password') }}
          </span>
          <div class="card w-full bg-base-100 shadow-xl mt-2">
            <div class="p-5">
              <h2 class="text-base font-bold">Password Rules</h2>
              <ul class="text-sm">
                <li
                  v-for="(rule, index) in passwordRules"
                  :key="index"
                  :class="[
                    rule.valid.value ? 'text-green-500' : 'text-red-500',
                  ]"
                >
                  <p class="flex">
                    <CheckIcon class="w-5 h-5" v-if=" rule.valid.value" />
                    <XMarkIcon class="w-5 h-5" v-else />
                    {{ rule.text }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.confirmPassword"
          />
          <span class="text-sm text-red-500">{{
            validateErrorMsg('confirmPassword')
          }}</span>
        </div>
        <div>
          <Button class="btn btn-block"> Sign Up </Button>
        </div>
      </form>
      <span class="mt-10 p-10">
        Already have an account?
        <span
          class="text-blue-500 hover:underline"
          @click="router.push('signin')"
          >Sign in</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped></style>
