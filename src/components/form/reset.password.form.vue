<script setup>
import { computed, onMounted, reactive } from 'vue';
import {
  required,
  email,
  maxLength,
  minLength,
  helpers,
  sameAs,
} from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['submitData']);

const formData = reactive({
  password: '',
  confirmPassword: '',
});

const strongPassword = () => {
  return passwordRules.value.every((rule) => rule.valid.value);
};

const rules = computed(() => {
  return {
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
  };
});

const validator = useVuelidate(rules, formData);

const passwordRules = computed(() => [
  {
    text: 'มีความยาวอย่างน้อย 8 ตัวอักษร',
    valid: computed(() => formData.password.length >= 8),
  },
  {
    text: 'มีอักษรตัวพิมพ์ใหญ่',
    valid: computed(() => new RegExp(`[A-Z]`).test(formData.password)),
  },
  {
    text: 'มีอักษรตัวพิมพ์เล็ก',
    valid: computed(() => new RegExp(`[a-z]`).test(formData.password)),
  },
  {
    text: 'มีตัวเลข',
    valid: computed(() => new RegExp(`[0-9]`).test(formData.password)),
  },
  {
    text: 'มีตัวอักษรพิเศษ',
    valid: computed(() => new RegExp(`[^A-Za-z0-9]`).test(formData.password)),
  },
]);
const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};

const submit = async () => {
  const result = await validator.value.$validate();
  if (result) {
    emit('submitData', formData);
  }else{
    console.log('submit error');
  }
};
</script>

<template>
  <form
    @submit.prevent="submit"
    class="p-10 mb-5 bg-white shadow-lg rounded-lg w-1/2"
  >
    <p class="font-bold text-2xl">เปลี่ยนรหัสผ่าน</p>
    <div>
      <label class="label">
        <span class="text-base label-text">รหัสผ่าน</span>
      </label>
      <input
        type="password"
        placeholder="รหัสผ่าน"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="formData.password"
      />
      <span class="text-xs text-red-500"
        >{{ validateErrorMsg('password') }}
      </span>
    </div>

    <div class="card w-full bg-base-100 shadow-sm mt-2">
      <div class="p-5">
        <h2 class="text-sm font-semibold">เงื่อนไขในการตั้งรหัสผ่าน</h2>
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

    <div>
      <label class="label">
        <span class="text-base label-text">ยืนยันรหัสผ่าน</span>
      </label>
      <input
        type="password"
        placeholder="ยืนยันรหัสผ่าน"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="formData.confirmPassword"
      />
      <span class="text-xs text-red-500">{{
        validateErrorMsg('confirmPassword')
      }}</span>
    </div>
    <div class="py-1">
      <button class="btn btn-block mt-2" type="submit">บันทึกข้อมูล</button>
    </div>
  </form>
</template>

<style scoped></style>
