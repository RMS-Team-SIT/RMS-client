<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import SigninForm from '@/components/form/signin.form.vue';
import SignupForm from '@/components/form/signup.form.vue';
import { computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import useVuelidate from '@vuelidate/core';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
// import Button from '@/components/common/button.vue';

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
});

const formData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  phone: '',
});

const setDataFromProps = () => {
  console.log(props.userData);
  for (const key in props.userData) {
    if (key in formData) formData[key] = props.userData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

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

const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};
</script>

<template>
  <form @submit.prevent="submitForm" class="space-y-0 px-10 mb-5">
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
        <span class="text-xs text-red-500">
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
        <span class="text-xs text-red-500">{{
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
      <span class="text-xs text-red-500">{{ validateErrorMsg('phone') }}</span>
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
      <span class="text-xs text-red-500">{{ validateErrorMsg('email') }}</span>
      <p class="text-xs text-gray-500">
        Please use a real email address for future correspondence.
      </p>
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Old Password</span>
      </label>
      <input
        type="password"
        placeholder="Enter Password"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="formData.password"
      />
      <span class="text-xs text-red-500"
        >{{ validateErrorMsg('password') }}
      </span>
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">New Password</span>
      </label>
      <input
        type="password"
        placeholder="Confirm Password"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="formData.confirmPassword"
      />
      <span class="text-xs text-red-500">{{
        validateErrorMsg('confirmPassword')
      }}</span>
      <div class="card w-full bg-base-100 shadow-sm mt-2">
        <div class="p-5">
          <h2 class="text-sm font-semibold">Password Rules</h2>
          <ul class="text-xs">
            <li
              v-for="(rule, index) in passwordRules"
              :key="index"
              :class="[rule.valid.value ? 'text-green-500' : 'text-red-500']"
            >
              <p class="flex">
                <CheckIcon class="w-5 h-5" v-if="rule.valid.value" />
                <XMarkIcon class="w-5 h-5" v-else />
                {{ rule.text }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="py-1">
      <button class="btn btn-block mt-2" type="submit"> Update Profile </button>
    </div>
  </form>
</template>

<style scoped></style>
