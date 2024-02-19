<script setup>
import Button from '../common/button.vue';
import { useRouter } from 'vue-router';
import { computed, reactive, ref } from 'vue';
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
  CheckIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import Loading from '../common/loading.vue';

const emit = defineEmits(['submit']);
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
const router = useRouter();
const isShowPasswordRules = ref(false);

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

const strongPassword = () => {
  return passwordRules.value.every((rule) => rule.valid.value);
};

const rules = computed(() => {
  const requiredMsg = helpers.withMessage('กรุณากรอกข้อมูล', required);
  return {
    firstname: { required: requiredMsg, maxLength: maxLength(500) },
    lastname: { required: requiredMsg, maxLength: maxLength(500) },
    email: {
      required: requiredMsg,
      email: helpers.withMessage('รูปแบบอีเมลไม่ถูกต้อง', email),
    },
    password: {
      required: requiredMsg,
      strongPassword: helpers.withMessage(
        'รหัสผ่านไม่ตรงตามเงื่อนไข',
        strongPassword
      ),
    },
    confirmPassword: {
      required: requiredMsg,
      sameAs: helpers.withMessage(
        'รหัสผ่านไม่ตรงกัน',
        sameAs(formData.password)
      ),
    },
    phone: { required: requiredMsg },
  };
});

const validator = useVuelidate(rules, formData);

const submitForm = async () => {
  const result = await validator.value.$validate();
  if (result) emit('submit', formData);
};

const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};
</script>

<template>
  <div
    class="relative flex flex-col justify-center min-h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-20 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 mb-5">
        เริ่มต้นจัดการหอพักของคุณ <br />
        ตอนนี้
      </h1>
      <p class="text-base mb-5">
        สร้างบัญชี <b>เจ้าของหอพัก</b> ของคุณเพื่อเริ่มต้น
      </p>
      <form @submit.prevent="submitForm" class="space-y-3 mb-5">
        <div class="flex gap-2">
          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">ชื่อ</span>
            </label>
            <input
              type="text"
              placeholder="กรุณากรอกชื่อ"
              class="w-full input-sm input input-bordered bg-white rounded-sm"
              v-model="formData.firstname"
            />
            <span class="text-xs text-red-500">
              {{ validateErrorMsg('firstname') }}</span
            >
          </div>

          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">นามสกุล</span>
            </label>
            <input
              type="text"
              placeholder="กรุณากรอกนามสกุล"
              class="w-full input input-bordered bg-white input-sm rounded-sm"
              v-model="formData.lastname"
            />
            <span class="text-xs text-red-500">{{
              validateErrorMsg('lastname')
            }}</span>
          </div>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">เบอร์โทรศัพท์</span>
          </label>
          <input
            type="text"
            maxlength="10"
            placeholder="กรุณากรอกเบอร์โทรศัพท์ของคุณ"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.phone"
          />
          <span class="text-xs text-red-500">{{
            validateErrorMsg('phone')
          }}</span>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">อีเมล</span>
          </label>
          <input
            type="email"
            placeholder="กรุณากรอกอีเมลของคุณ"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.email"
          />
          <span class="text-xs text-red-500">{{
            validateErrorMsg('email')
          }}</span>
          <p class="text-xs text-gray-500">
            กรุณาใช้ที่อยู่อีเมลจริงสำหรับการติดต่อในอนาคต
          </p>
        </div>

        <div>
          <label class="label">
            <span class="text-base label-text">รหัสผ่าน</span>
          </label>
          <div class="flex w-full items-center gap-2">
            <input
              type="password"
              placeholder="กรุณาใส่รหัสผ่านของคุณ"
              class="w-full input input-bordered bg-white input-sm rounded-sm"
              v-model="formData.password"
            />
            <div
              class="tooltip tooltip-right"
              data-tip="กดเพื่อแสดงเงื่อนไข"
              v-on:click="isShowPasswordRules = !isShowPasswordRules"
            >
              <InformationCircleIcon class="w-6" />
            </div>
          </div>

          <span class="text-xs text-red-500"
            >{{ validateErrorMsg('password') }}
          </span>
          <div
            class="card w-full bg-base-100 shadow-sm mt-2"
            v-show="isShowPasswordRules"
          >
            <div class="p-5">
              <h2 class="text-sm font-semibold">เงื่อนไขในการตั้งรหัสผ่าน</h2>
              <ul class="text-xs">
                <li
                  v-for="(rule, index) in passwordRules"
                  :key="index"
                  :class="[
                    rule.valid.value ? 'text-green-500' : 'text-red-500',
                  ]"
                >
                  <p class="flex items-center gap-2">
                    <CheckIcon class="w-5 h-5" v-if="rule.valid.value" />
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
            <span class="text-base label-text">ยืนยันรหัสผ่าน</span>
          </label>
          <input
            type="password"
            placeholder="กรุณายืนยันรหัสผ่านของคุณ"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.confirmPassword"
          />
          <p class="text-xs text-gray-500">
            กรุณาใส่รหัสผ่านอีกครั้งเพื่อยืนยัน
          </p>
          <span class="text-xs text-red-500">{{
            validateErrorMsg('confirmPassword')
          }}</span>
        </div>
        <div class="py-1">
          <div v-if="!isLoading">
            <Button class="btn btn-block mt-2" type="submit">
              สมัครสมาชิก
            </Button>
          </div>
          <div v-else>
            <Button class="btn btn-block mt-2 disabled" type="disable" disabled>
              กำลังสมัครสมาชิก
              <span class="loading loading-dots loading-xs"></span>
            </Button>
          </div>
        </div>
      </form>
      <span class="mt-10">
        มีบัญชี<b>เจ้าของหอพัก</b>อยู่แล้ว?
        <span
          class="text-dark-blue-200 hover:underline cursor-pointer"
          @click="router.push({ name: 'signin' })"
          >เข้าสู่ระบบ</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped></style>
