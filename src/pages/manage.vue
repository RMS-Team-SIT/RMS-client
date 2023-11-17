<script setup>
import NavbarLoggedin from '@/components/navbar-loggedin.vue';
import Breadcrumb from '@/components/breadcrumb.vue';
</script>

<template>
  <NavbarLoggedin />
  <Breadcrumb :pathList="['home', 'manage', 'resident']" />
  <Breadcrumb/>
</template>

<style scoped></style>
