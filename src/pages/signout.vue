<script setup>
import { useUserStore } from '@/stores/user.store';
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';

const { notify } = useNotification();
const router = useRouter();
const userStore = useUserStore();

// clear user from store
userStore.clearUser();

// clear token from local storage
localStorage.removeItem('token');

// redirect to login page
router.push({ name: 'signin' });

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
