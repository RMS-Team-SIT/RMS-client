<script setup>
import SignupForm from '@/components/signup.form.vue';

</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 bg-cover flex flex-row">
      <div class="basis-1/2">
        <SignupForm />
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
