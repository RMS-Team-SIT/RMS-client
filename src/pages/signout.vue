<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';

const { notify } = useNotification();
const router = useRouter();
// clear token from local storage
localStorage.removeItem('token');
// redirect to login page
router.push({ name: 'signin' });
notify({
  group: 'tr',
  title: 'สำเร็จ',
  text: 'ออกจากระบบเรียบร้อย',
  type: 'success',
});
</script>

<template></template>

<style scoped></style>
