<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
// clear token from local storage
localStorage.removeItem('token');
// redirect to login page
router.push({ name: 'signin' });
</script>

<template></template>

<style scoped></style>
