<script setup>
import Button from '../common/button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const emit = defineEmits(['submit-form']);

const formData = reactive({
  email: '',
});

const submitForm = async () => {
  emit('submit-form', formData);
};
</script>

<template>
  <div
    class="relative flex flex-col justify-center min-h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-6 m-auto bg-white rounded-md">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10 md:px-40 mb-5">
        รีเซตรหัสผ่าน<br />
      </h1>
      <p class="text-sm px-10 md:px-40 mb-5">
        กรุณาป้อนที่อยู่อีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน
      </p>
      <form @submit.prevent="submitForm" class="space-y-4 px-10 md:px-40">
        <div>
          <label class="label">
            <span class="text-base label-text">อีเมลของคุณ</span>
          </label>
          <input
            type="email"
            placeholder="ที่อยู่อีเมล"
            class="w-full input input-bordered bg-white input-sm rounded-sm"
            v-model="formData.email"
            required
          />
        </div>
        <div>
          <Button class="btn btn-block" type="submit">
            <ArrowRightIcon class="w-5 h-5" />
            <p>รีเซตรหัสผ่าน</p>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
