<script setup>
import { projectName, projectFullName } from '@/constants';
import { useRouter } from 'vue-router';
import Button from './button.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import logoImg from '@/assets/img/logo.png';
import { BellIcon } from '@heroicons/vue/24/outline';
import Divider from './divider.vue';
import Badge from './badge.vue';

const router = useRouter();

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg px-40">
    <div
      class="flex-1 gap-4 cursor-pointer"
      @click="router.push({ name: 'home' })"
    >
      <img class="w-12 h-12" :src="logoImg" alt="" />
      <a class="text-xl">
        <span class="font-bold text-dark-blue-200">{{ projectName }}</span>
      </a>
    </div>
    <div class="flex-none" v-if="!isLoggedIn">
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li><router-link :to="{ name: 'home' }">Home</router-link></li>
        <li><router-link :to="{ name: 'home' }">About</router-link></li>
        <router-link to="/signin">
          <Button btnType="primary-pill">Sign In</Button>
        </router-link>
      </ul>
    </div>
    <div class="flex-none" v-else>
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li><router-link :to="{ name: 'home' }">Home</router-link></li>
        <li><router-link :to="{ name: 'manage' }">Manage</router-link></li>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <BellIcon class="w-6 h-6" />
              <span class="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div
            tabindex="0"
            class="mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-100 shadow max-h-[500px] overflow-y-auto"
          >
            <div class="card-body">
              <span class="font-bold text-lg">8 Notifications</span>
              <div v-for="(val, index) in new Array(8).fill(0)" :key="index">
                <div class="border-2 border-neutral rounded hover:bg-slate-200 p-5 pt-0">
                  <Divider class="text-xs">[12-07-2023 03:20:39]</Divider>
                  <div class="text-left">Siriwat just upload paid evidence</div>
                  <div class="text-left">
                    <Badge type="neutral">The Resident</Badge>
                    <Badge type="primary">Room 101</Badge>
                  </div>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary btn-block">View All</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" :src="blankprofileImg" />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <router-link :to="{ name: 'profile' }">Profile</router-link>
            </li>
            <!-- <li><a>Settings</a></li> -->
            <li>
              <router-link :to="{ name: 'signout' }">Sign Out</router-link>
            </li>
          </ul>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
