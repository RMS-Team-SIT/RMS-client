<script setup>
import { projectName, projectFullName } from '@/constaint';
import { useRouter } from 'vue-router';
import Button from './button.vue';

const router = useRouter();

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const goto = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg px-8">
    <div class="flex-1 gap-4">
      <img class="w-12 h-12" src="logo.png" alt="" />
      <a class="text-xl">
        <span class="font-bold text-dark-blue-200">{{ projectName }}</span>
      </a>
    </div>
    <div class="flex-none">
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li c><a>Home</a></li>
        <li><a>About</a></li>

        <Button btnType="primary" @click="goto('/signup')" >Sign In</Button>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>