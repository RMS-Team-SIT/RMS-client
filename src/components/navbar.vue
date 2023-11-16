<script setup>
import Button from './button.vue';

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <img class="w-12 h-12" src="logo.png" alt="" />
      <a class="text-xl flex gap-2">
        <span class="font-bold text-dark-blue"> | </span>
        <span class="font-bold text-light-red">RMS</span>
        <span class="text-dark-blue font-semibold">Project</span>
      </a>
    </div>
    <div class="flex-none">
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li c><a>Home</a></li>
        <li><a>About</a></li>
        <Button text="Sign In" />
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
