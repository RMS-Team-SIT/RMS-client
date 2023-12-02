<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRoute, useRouter } from 'vue-router';
import UserService from '@/services/UserServices';
import ResetPasswordForm from '@/components/form/reset.password.form.vue';

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
      title: 'Success',
      text: `Reset password successful`,
      type: 'success',
    });
    router.push({ name: 'signin' });
  } else {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Reset failed, ' + data.message + ' Please try again',
      type: 'error',
    });
  }
};
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
