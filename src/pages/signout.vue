<script setup>
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';

const { notify } = useNotification();
const router = useRouter();
const userStore = useUserStore();

// Redirect to login page
router.push({ name: 'signin' });

// Clear user from store
userStore.clearUser();

// Clear token from local storage
localStorage.removeItem('token');

// show notification
notify({
  group: 'tr',
  title: 'สำเร็จ',
  text: 'ออกจากระบบเรียบร้อย',
  type: 'success',
});
</script>

<template></template>

<style scoped></style>
