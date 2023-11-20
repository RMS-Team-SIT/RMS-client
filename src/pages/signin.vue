<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { signIn } from '@/services/userServices';

const handleFormData = async (formData) => {
  const response = await signIn(formData);
  if (response.status === 200) {
    alert('Sign In success');
    let data = await response.json();
    // save to local storage
    localStorage.setItem('token', data.access_token);
  } else {
    alert('Sign In failed');
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
  background-image: url('5.jpg');
  background-position: center;
}
</style>
