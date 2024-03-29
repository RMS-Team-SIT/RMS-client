<script setup>
import SignupForm from '@/components/form/signup.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import UserService from '@/services/UserServices.js';
import router from '@/routes';
import { ref } from 'vue';

const { notify } = useNotification();
const isLoading = ref(false);

const handleFormData = async (formData) => {
  isLoading.value = true;
  const response = await UserService.signUp(formData);
  if (response.status === 201) {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'สมัครสมาชิกเรียบร้อยแล้ว',
      type: 'success',
    });
    router.push({ name: 'signin' });
  } else {
    let data = await response.json();
    let errorKeys = Object.keys(data.errors || []);
    console.log(errorKeys);
    let errorMsg = '';
    errorKeys.forEach((key) => {
      errorMsg += data.errors[key] + '\n';
    });
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'สมัครสมาชิกไม่สำเร็จ, โปรดลองใหม่อีกครั้ง: ' + errorMsg,
      type: 'error',
    });
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="flex">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="w-full md:w-1/3 lg:w-1/2">
        <SignupForm @submit="handleFormData" :isLoading="isLoading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('/4.jpg');
  background-position: center;
}
</style>
