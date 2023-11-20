<script setup>
import SignupForm from '@/components/form/signup.form.vue';
import { signUp } from '@/services/userServices';

const handleFormData = async (formData) => {
  const response = await signUp(formData);
  if (response.status === 200) {
    alert('Sign Up success');
    let data = await response.json();
    localStorage.setItem('token', data.access_token);
  } else {
    alert('Sign Up failed');
  }
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <SignupForm @form-data="handleFormData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('4.jpg');
  background-position: center;
}
</style>
