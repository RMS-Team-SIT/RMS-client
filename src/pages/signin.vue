<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { signIn } from '@/services/userServices';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();

const handleFormData = async (formData) => {
  const response = await signIn(formData);
  if (response.status === 200) {
    alert('Sign In success');
    let data = await response.json();
    
    localStorage.setItem('token', data.access_token);
    store.fetchMe();

    router.push({ name: 'manage' });
  } else {
    alert('Sign In failed');
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
  background-image: url('5.jpg');
  background-position: center;
}
</style>
