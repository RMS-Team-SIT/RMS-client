<script setup>
import UserServices from '@/services/UserServices';
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { notify } = useNotification();
const token = route.params.token;

const verify = async () => {
  const response = await UserServices.verifyEmail(token);
  if (response.status === 200) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: `ยืนยันอีเมลเรียบร้อยแล้ว`,
      type: 'success',
    });
    router.push({ name: 'home' });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: `เกิดข้อผิดพลาด. ${data.message}` ,
      type: 'error',
    });
    router.push({ name: 'signin' });
  }
};

onMounted(async () => {
  if (!token) {
    router.push({ name: 'signin' });
  }
  await verify();
});
</script>

<template></template>

<style scoped></style>
