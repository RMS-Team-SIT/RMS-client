<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserServices';
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
      title: 'Success',
      text: `Email sent to ${formData.email} successful`,
      type: 'success',
    });
  } else {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Email sent failed, ' + data.message + ' Please try again',
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <ForgetPasswordForm @submit-form="handleFormData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('5.jpg');
  background-position: center;
}
</style>
