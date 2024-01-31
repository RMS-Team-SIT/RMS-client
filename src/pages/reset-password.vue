<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRoute, useRouter } from 'vue-router';
import UserService from '@/services/UserServices.js';
import ResetPasswordForm from '@/components/form/reset.password.form.vue';
import { onBeforeMount, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const token = route.params.token;
const { notify } = useNotification();

const handleFormData = async (formData) => {
  const response = await UserService.resetPassword(token, formData);
  if (response.status === 200) {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: `เปลี่ยนรหัสผ่านเรียบร้อยแล้ว`,
      type: 'success',
    });
    router.push({ name: 'signin' });
  } else {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text:
        'เปลี่ยนรหัสผ่านไม่สำเร็จ, ' + data.message + ' โปรดลองใหม่อีกครั้ง',
      type: 'error',
    });
  }
};

const checkValidToken = async () => {
  const response = await UserService.checkValidResetPasswordToken(token);
  if (response.status === 200) {
    return true;
  } else {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: data.message + ', โปรดลองใหม่อีกครั้ง',
      type: 'error',
    });
    return false;
  }
};

onBeforeMount(async () => {
  if (!token) {
    router.push({ name: 'signin' });
  }

  const isValidToken = await checkValidToken();
  if (!isValidToken) {
    router.push({ name: 'signin' });
  }
});
</script>

<template>
  <div class="h-screen flex justify-center w-full">
    <ResetPasswordForm @submitData="handleFormData" />
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('/5.jpg');
  background-position: center;
}
</style>
