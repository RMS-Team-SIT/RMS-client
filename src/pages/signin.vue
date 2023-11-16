<script setup>
import SigninForm from '@/components/signin.form.vue';
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <SigninForm />
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
