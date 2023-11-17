<script setup>
import SignupForm from '@/components/signup.form.vue';
import { signUp } from '@/services/userServices';
import { reactive } from 'vue';

const handleFormData = async (formData) => {
  console.log('API call with form data:', formData);
  const result = await signUp(formData);
  console.log(result);
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
