<script setup>
import Button from '../common/button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { computed, reactive } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required, email } from '@vuelidate/validators';

const router = useRouter();
const emit = defineEmits(['submit']);
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const formData = reactive({
  email: '',
  password: '',
});

const rules = computed(() => {
  const requiredMsg = helpers.withMessage('กรุณากรอกข้อมูล', required);
  return {
    email: {
      required: requiredMsg,
      email: helpers.withMessage('รูปแบบอีเมลไม่ถูกต้อง', email),
    },
    password: {
      required: requiredMsg,
    },
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
    class="relative flex flex-col justify-center min-h-screen overflow-hidden bg-white font-nato"
  >
    <div class="w-full p-20 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 mb-5">
        ยินดีต้อนรับกลับ !<br />
      </h1>
      <p class="text-sm mb-5">ลงชื่อเข้าใช้และเริ่มจัดการที่อยู่อาศัยของคุณ</p>
      <form @submit.prevent="submitForm" class="space-y-4 mb-5">
        <div>
          <label class="label">
            <span class="text-base label-text">อีเมล</span>
          </label>
          <input
            name="email"
            roles="required|email"
            type="email"
            placeholder="ใส่อีเมลของคุณ"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.email"
          />
          <span class="text-xs text-red-500">
            {{ validateErrorMsg('email') }}</span
          >
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">รหัสผ่าน</span>
          </label>
          <input
            type="password"
            placeholder="ใส่รหัสผ่านของคุณ"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.password"
          />
          <span class="text-xs text-red-500">
            {{ validateErrorMsg('password') }}</span
          >
        </div>

        <div>
          <p
            class="text-dark-blue-200 hover:underline"
            @click="router.push({ name: 'forget-password' })"
          >
            ลืมรหัสผ่าน ?
          </p>
        </div>
        <div v-if="!isLoading">
          <Button class="btn btn-block" type="submit">
            <ArrowRightIcon class="w-5 h-5" />
            เข้าสู่ระบบ
          </Button>
        </div>
        <div v-else>
          <Button class="btn btn-block mt-2 disabled" type="disable" disabled>
            กำลังลงชื่อเข้าใช้...
            <span class="loading loading-dots loading-xs"></span>
          </Button>
        </div>
      </form>
      <span class="mt-10">
        ยังไม่มีบัญชีผู้ใช้?
        <span
          class="text-dark-blue-200 hover:underline cursor-pointer"
          @click="router.push({ name: 'signup' })"
          >สมัครสมาชิก</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped></style>
