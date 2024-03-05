<script setup>
import { projectName, projectFullName } from '@/utils/constants';
import { useRouter } from 'vue-router';
import Button from './button.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import logoImg from '@/assets/img/logo.png';
import { BellIcon } from '@heroicons/vue/24/outline';
import Divider from './divider.vue';
import Badge from './badge.vue';
import ChangeLang from './change-lang.vue';
import NavNotification from './nav-notification.vue';

const router = useRouter();

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <div class="navbar shadow-sm p-0 px-10 md:px-40 bg-base-100 border-b">
    <div
      class="flex-1 gap-4 cursor-pointer"
      @click="router.push({ name: 'home' })"
    >
      <img class="w-12 h-12" :src="logoImg" alt="" />
      <a class="text-xl">
        <!-- <span class="font-bold text-dark-blue-200">{{ projectFullName }}</span> -->
      </a>
    </div>
    <div class="flex-none" v-if="!isLoggedIn">
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <li>
          <router-link :to="{ name: 'home' }">หน้าแรก</router-link>
        </li>
        <li><router-link :to="{ name: 'home' }">เกี่ยวกับเรา</router-link></li>
        <router-link to="/signin">
          <Button btnType="primary-pill">เข้าสู่ระบบ</Button>
        </router-link>
      </ul>
    </div>
    <div class="flex-none" v-else>
      <ul
        class="menu menu-horizontal px-1 text-center align-middle items-center"
      >
        <!-- <li><router-link :to="{ name: 'manage' }">จัดการ</router-link></li> -->
        <NavNotification :notifications="user.notifications" />
        <div class="flex gap-2 items-center rounded-lg p-2">
          <p>
            {{ user.fullname }} {{ user.role === 'admin' ? ': admin' : '' }}
          </p>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img alt="image profile" :src="blankprofileImg" />
              </div>
            </label>
            <ul
              tabindex="0"
              class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <router-link :to="{ name: 'profile' }"
                  >ข้อมูลส่วนตัว</router-link
                >
              </li>
              <li>
                <router-link :to="{ name: 'signout' }">ออกจากระบบ</router-link>
              </li>
            </ul>
          </div>
        </div>
      </ul>
    </div>
    <!-- <ChangeLang /> -->
  </div>
</template>

<style scoped></style>
