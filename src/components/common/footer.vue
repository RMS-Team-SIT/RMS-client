<script setup>
import { projectFullName } from '@/utils/constants';
import Logo from './logo.vue';

const thisYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer p-10 bg-gray-100 text-base-content rounded">
    <aside>
      <Logo />
      <p>
        {{ projectFullName }}<br />&copf; {{ thisYear }}. All rights reserved.
      </p>
    </aside>
    <nav>
      <header class="footer-title">Services</header>
      <div class="link link-hover">Manage</div>
      <div class="link link-hover">Dashboard</div>
    </nav>
    <nav>
      <header class="footer-title">Company</header>
      <div class="link link-hover">About us</div>
      <div class="link link-hover">Contact</div>
    </nav>
    <nav>
      <header class="footer-title">Legal</header>
      <div class="link link-hover">Terms of use</div>
      <div class="link link-hover">Privacy policy</div>
      <div class="link link-hover">Cookie policy</div>
    </nav>
    <p class="p-2 w-full text-center text-sm">&copf; RMS team</p>
  </footer>
</template>

<style scoped>
/* footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  } */
</style>
