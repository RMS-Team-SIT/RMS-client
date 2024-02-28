<script setup>
import { computed, onMounted, reactive } from 'vue';
import { required, email, maxLength, helpers } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import Divider from '../common/divider.vue';
// import Button from '@/components/common/button.vue';

const emit = defineEmits(['submitData']);

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
  phone: '',
});

const setDataFromProps = () => {
  for (const key in props.userData) {
    if (key in formData) formData[key] = props.userData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

const rules = computed(() => {
  return {
    firstname: { required, maxLength: maxLength(500) },
    lastname: { required, maxLength: maxLength(500) },
    email: { required, email },
    phone: { required },
  };
});

const validator = useVuelidate(rules, formData);

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
    <p class="font-bold text-2xl">แก้ไขขอมูลส่วนตัว</p>
    <div class="flex gap-2">
      <div class="w-full">
        <label class="label">
          <span class="text-base label-text">ชื่อ</span>
        </label>
        <input
          type="text"
          placeholder="ชื่อ"
          class="w-full input-sm input input-bordered bg-white  rounded-sm"
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
          placeholder="นามสกุล"
          class="w-full input input-bordered bg-white  input-sm rounded-sm"
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
        placeholder="เบอร์โทรศัพท์"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="formData.phone"
      />
      <span class="text-xs text-red-500">{{ validateErrorMsg('phone') }}</span>
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">อีเมล</span>
      </label>
      <input
        type="email"
        placeholder="อีเมล"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="formData.email"
        :disabled="userData.isEmailVerified"
      />
      <span class="text-xs text-red-500" v-if="!userData.isEmailVerified">
        * อีเมลของคุณยังไม่ได้รับการยืนยัน หากทำการยืนยันจะไม่สามารถเปลี่ยนได้
      </span>
      <span class="text-xs text-red-500">{{ validateErrorMsg('email') }}</span>
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">เลขประจำตัวประชาชน</span>
      </label>
      <input
        type="text"
        placeholder="เลขประจำตัวประชาชน"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="userData.idcardNumber"
        :disabled="true"
      />
     
      <span class="text-xs text-red-500">{{ validateErrorMsg('email') }}</span>
    </div>
    <div class="py-1">
      <button class="btn btn-block mt-2" type="submit">
        บันทึกข้อมูล
      </button>
    </div>
  </form>
</template>

<style scoped></style>
