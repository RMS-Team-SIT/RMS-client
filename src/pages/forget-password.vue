<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserServices.js';
import ForgetPasswordForm from '@/components/form/forget.password.form.vue';

const store = useUserStore();
const router = useRouter();
const { notify } = useNotification();

const handleFormData = async (formData) => {
  const response = await UserService.forgetPassword(formData);
  if (response.status === 200) {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: `ส่งข้อมูลการรีเซตรหัสผ่านไปที่ ${formData.email} แล้ว`,
      type: 'success',
    });
  } else {
    let data = await response.json();
    console.log(data);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'อีเมลไม่ถูกต้อง โปรดลองใหม่อีกครั้ง',
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="w-full md:w-2/3 lg:w-1/2">
        <ForgetPasswordForm @submit-form="handleFormData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('/5.jpg');
  background-position: center;
}
</style>
