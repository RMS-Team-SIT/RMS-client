<script setup>
import { projectName, projectFullName } from '@/constants';
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
      <img class="w-12 h-12" src="/logo.png" alt="" />
      <a class="text-xl">
        <span class="font-bold text-dark-blue-200">{{ projectName }}</span>
      </a>
    </div>
    <div class="flex-none" v-if="!isLoggedIn">
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li c><a>Home</a></li>
        <li><a>About</a></li>

        <Button btnType="primary" @click="goto('/signin')">Sign In</Button>
      </ul>
    </div>
    <div class="flex-none" v-else>
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li><a>Home</a></li>
        <li><p @click="goto('manage')">Manage</p></li>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="/blank-profile.webp"
              />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a class="justify-between"> Profile </a>
            </li>
            <li><a>Settings</a></li>
            <li><p @click="goto('signout')">Logout</p></li>
          </ul>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>