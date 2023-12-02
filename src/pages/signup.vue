<script setup>
import SignupForm from '@/components/form/signup.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import UserService from '@/services/UserServices.js';
import router from '@/routes';

const { notify } = useNotification();

const handleFormData = async (formData) => {
  const response = await UserService.signUp(formData);
  if (response.status === 201) {
    let data = await response.json();
    localStorage.setItem('token', data.access_token);
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Sign Up successful',
      type: 'success',
    });
    router.push({ name: 'signin' });
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Sign Up failed, Please try again',
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="flex">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <SignupForm @form-data="handleFormData" />
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
