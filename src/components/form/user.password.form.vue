<script setup>
import { computed, onMounted, reactive } from 'vue';
import { required, email, maxLength, helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Divider from '../common/divider.vue';

const emit = defineEmits(['submitData']);

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
});

const formData = reactive({
  oldPassword: '',
  newPassword: '',
});

const setDataFromProps = () => {
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
    oldPassword: { required },
    newPassword: {
      required,
      strongPassword: helpers.withMessage(
        "Password doen't meet the rules",
        strongPassword
      ),
    },
    phone: { required },
  };
});

const validator = useVuelidate(rules, formData);

const passwordRules = computed(() => [
  {
    text: 'Contain 8 Letters',
    valid: computed(() => formData.newPassword.length >= 8),
  },
  {
    text: 'Contain Upper Letter',
    valid: computed(() => new RegExp(`[A-Z]`).test(formData.newPassword)),
  },
  {
    text: 'Contain Lower Letter',
    valid: computed(() => new RegExp(`[a-z]`).test(formData.newPassword)),
  },
  {
    text: 'Contain Number',
    valid: computed(() => new RegExp(`[0-9]`).test(formData.newPassword)),
  },
  {
    text: 'Contain Symbol',
    valid: computed(() =>
      new RegExp(`[^A-Za-z0-9]`).test(formData.newPassword)
    ),
  },
]);

const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};

const submit = async () => {
  const result = await validator.value.$validate();
  if (result) emit('submitData', formData);
};

</script>

<template>
  <form
    @submit.prevent="submit"
    class="space-y-0 p-10 mb-5 bg-white shadow-lg rounded-lg"
  >
    <p class="font-bold text-2xl">Edit Password</p>
    <div>
      <label class="label">
        <span class="text-base label-text">Old Password</span>
      </label>
      <input
        type="password"
        placeholder="Enter Password"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="formData.oldPassword"
      />
      <span class="text-xs text-red-500"
        >{{ validateErrorMsg('oldPassword') }}
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
        v-model="formData.newPassword"
      />
      <span class="text-xs text-red-500">{{
        validateErrorMsg('newPassword')
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
      <button class="btn btn-block mt-2" type="submit">Update Password</button>
    </div>
  </form>
</template>

<style scoped></style>
