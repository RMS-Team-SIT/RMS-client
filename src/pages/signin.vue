<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserServices.js';
import { ref } from 'vue';

const store = useUserStore();
const router = useRouter();
const { notify } = useNotification();
const isLoading = ref(false);

const handleFormData = async (formData) => {
  isLoading.value = true;
  const response = await UserService.signIn(formData);
  if (response.status === 200) {
    let data = await response.json();

    localStorage.setItem('token', data.access_token);
    await store.fetchUserData();

    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'เข้าสู่ระบบสำเร็จ',
      type: 'success',
    });

    const user = store.getUser;

    // check if user is admin
    if (user.role === 'admin') {
      router.push({ name: 'admin-dashboard' });
    } else {
      router.push({ name: 'manage' });
    }
  } else {
    let data = await response.json();
    console.log(data);
    notify({
      group: 'tr',
      title: 'ไม่สามารถเข้าสู่ระบบได้',
      text: data?.message,
      type: 'error',
    });
    store.clearUser();
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="w-full md:w-1/3 lg:w-1/2">
        <SigninForm @submit="handleFormData" :isLoading="isLoading" />
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
