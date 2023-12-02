<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserServices.js';

const store = useUserStore();
const router = useRouter();
const { notify } = useNotification();

const handleFormData = async (formData) => {
  const response = await UserService.signIn(formData);
  if (response.status === 200) {
    let data = await response.json();

    localStorage.setItem('token', data.access_token);
    store.fetchMe();

    notify({
      group: 'tr',
      title: 'Success',
      text: 'Sign In successful',
      type: 'success',
    });
    
    router.push({ name: 'manage' });
  } else {
    let data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: `Sign In failed, ${data.message}`,
      type: 'error',
    });
    store.clearUser();
  }
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <SigninForm @submit-form="handleFormData" />
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
